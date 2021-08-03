import { TableUserConfig } from "table";

type ActualWidth = {
  numWidth: number; // fixed
  priWidth: number; // fixed
  textWidth: number; // dyn: 3/5
  projWidth: number; // dyn: 1/5
  ctxWidth: number; // dyn: 1/5
  dueWidth: number; // fixed
};

type ResultWidth = {
  textWidth: number;
  projWidth: number;
  ctxWidth: number;
};

export function calculateWidth(totalWidth: number, {
  numWidth, priWidth, textWidth, projWidth, ctxWidth, dueWidth
}: ActualWidth, spacing: number): ResultWidth | null {
  const actualTotal = numWidth + priWidth + textWidth + projWidth + ctxWidth + dueWidth + spacing;
  if (actualTotal <= totalWidth)
    return null;
  const overflow = actualTotal - totalWidth;
  const dynamic = totalWidth - numWidth - priWidth - dueWidth - spacing;

  const expectedProj = Math.floor(dynamic / 5);
  const expectedCtx = Math.floor(dynamic / 5);
  const expectedText = dynamic - expectedProj - expectedCtx;

  // Distribute overflow based on the ratio
  const projRatio = Math.max(projWidth - expectedProj, 0);
  const ctxRatio = Math.max(ctxWidth - expectedCtx, 0);
  const textRatio = Math.max(textWidth - expectedText, 0);
  const totalRatio = projRatio + ctxRatio + textRatio;

  const overflowProj = Math.ceil(overflow * projRatio / totalRatio);
  const overflowCtx = Math.ceil(overflow * ctxRatio / totalRatio);
  const overflowText = Math.max(overflow - overflowProj - overflowCtx, 0);

  return {
    textWidth: textWidth - overflowText,
    projWidth: projWidth - overflowProj,
    ctxWidth: ctxWidth - overflowCtx
  } as ResultWidth;
}

export const tableConfig: TableUserConfig = {
  drawHorizontalLine: index => index === 1,
  border: {
    bodyLeft: "",
    bodyRight: "",
    bodyJoin: "",
    bottomLeft: "",
    bottomRight: "",
    bottomJoin: "",
    bottomBody: "-",

    joinLeft: "",
    joinRight: "",
    joinJoin: ""
  }
};
