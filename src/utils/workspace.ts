import * as fs from "fs";
import { emptyRootGuard, workspacePath } from "./config";

export type Workspace = {
  projects?: string[],
  contexts?: string[]
};

export function readWorkspace() {
  let workspace: Workspace;
  try {
    workspace = JSON.parse(fs.readFileSync(workspacePath, { encoding: "utf8" }));
  }
  catch (error) {
    workspace = {};
  }

  return workspace;
}

export function writeWorkspace(workspace: Workspace | null) {
  emptyRootGuard();

  if (workspace === null) {
    if (fs.existsSync(workspacePath))
      fs.unlinkSync(workspacePath);
  }
  else {
    fs.writeFileSync(
      workspacePath,
      JSON.stringify(workspace, null, "\t"),
      { encoding: "utf8" }
    );
  }
}
