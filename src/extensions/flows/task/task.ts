/* eslint-disable max-classes-per-file */

import { Observable } from 'rxjs';
import { join } from 'path';
import { readFile } from 'fs-extra';
import { Exec } from '@teambit/capsule';
import { ComponentCapsule } from '../../capsule-ext';
import { createExecutionStream } from './execution-stream';

export const PackageMarker = '#';

export class Task {
  static async execute(task: string, capsule: ComponentCapsule): Promise<Observable<any>> {
    const isExtension = task.trim().startsWith(PackageMarker);

    const time = new Date();
    let exec: Exec;

    if (isExtension) {
      const { host, pathToScript } = await createHostScript(capsule, task);
      exec = await capsule.execNode(host, { args: [pathToScript] });
    } else {
      exec = await capsule.typedExec({
        command: task.trim().split(' '),
        cwd: capsule.wrkDir
      });
    }

    const stream = createExecutionStream(exec, `${capsule.bitId}:${task}`, time);

    return stream;
  }
}

async function createHostScript(capsule: ComponentCapsule, task: string) {
  const parts = task
    .trim()
    .slice(1)
    .split(':');
  const host = '__bit_container.js';
  const containerScript = await readFile(join(__dirname, 'container-script.js'), { encoding: 'utf8' });
  capsule.fs.writeFileSync(host, containerScript, { encoding: 'utf8' });
  return { host, pathToScript: join(...parts) };
}

/*
{
           PackageMarker                                                PipeMarker
           ^                                                            ^
           |                                                            |
  build: ['#bit/envs.react:compile-ts', 'tsc -d', 'cp -r temp/ dist/', '*test', 'node node_modules/bin/tsc'],
  test: ['jest --something *.spec.js']
}
*/