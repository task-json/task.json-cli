/**
 * Copyright (C) 2020-2022 DCsunset
 * See full notice in README.md in this project
 */

import { TableUserConfig } from "table";

type ActualWidth = {
  numWidth: number; // fixed
  priWidth: number; // fixed
  textWidth: number; // dyn: remaining
  depWidth: number; // dyn: 1/8
  projWidth: number; // dyn: 1/5
  ctxWidth: number; // dyn: 1/6
  waitWidth: number; // fixed
  dueWidth: number; // fixed
};

type ResultWidth = {
  textWidth: number;
  projWidth: number;
  ctxWidth: number;
  depWidth: number;
};

export function calculateWidth(totalWidth: number, {
  numWidth, priWidth, textWidth, projWidth, ctxWidth, dueWidth, depWidth, waitWidth
}: ActualWidth, spacing: number): ResultWidth | null {
  const actualTotal = numWidth + priWidth + textWidth + projWidth + ctxWidth + dueWidth + depWidth + waitWidth + spacing;
  // No need to wrap
  if (actualTotal <= totalWidth)
    return null;
  const overflow = actualTotal - totalWidth;
  const dynamic = totalWidth - numWidth - priWidth - dueWidth - waitWidth - spacing;

  const expectedProj = Math.floor(dynamic / 5);
  const expectedCtx = Math.floor(dynamic / 6);
  const expectedDeps = depWidth > 0 ? Math.floor(dynamic / 8) : 0;
  const expectedText = dynamic - expectedProj - expectedCtx - expectedDeps;

  // Distribute overflow based on the ratio
  const projRatio = Math.max(projWidth - expectedProj, 0);
  const ctxRatio = Math.max(ctxWidth - expectedCtx, 0);
  const textRatio = Math.max(textWidth - expectedText, 0);
  const depRatio = Math.max(depWidth - expectedDeps, 0);
  const totalRatio = projRatio + ctxRatio + textRatio + depRatio;

  const overflowProj = Math.ceil(overflow * projRatio / totalRatio);
  const overflowCtx = Math.ceil(overflow * ctxRatio / totalRatio);
  const overflowDeps = Math.ceil(overflow * depRatio / totalRatio);
  const overflowText = Math.max(overflow - overflowProj - overflowCtx - overflowDeps, 0);

  return {
    textWidth: textWidth - overflowText,
    projWidth: projWidth - overflowProj,
    ctxWidth: ctxWidth - overflowCtx,
    depWidth: depWidth - overflowDeps
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
