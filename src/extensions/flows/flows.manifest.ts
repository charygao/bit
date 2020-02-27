/* eslint-disable @typescript-eslint/no-unused-vars */
import { Flows } from './flows';
import { BitCliExt, BitCli } from '../cli';
import { WorkspaceExt, Workspace } from '../workspace';
import { Harmony } from '../../harmony';
import { RunCmd } from './run.cmd';

type ScriptDeps = [BitCli, Workspace];

export default {
  name: 'scripts',
  dependencies: [BitCliExt, WorkspaceExt],
  async provider(config: {}, [cli, workspace]: ScriptDeps, harmony: Harmony<unknown>) {
    const flows = new Flows(workspace);
    const runCMD = new RunCmd(flows);
    cli.register(runCMD);
    return flows;
  }
};