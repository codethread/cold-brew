// tasks
// 1. get brew commands to pass through
// 2. get output to display
// 3. colors and stuff
// 4. handle input mid command
// 5. exit codes
// 6. add custom steps
import { spawn } from "child_process";
import { writeFile } from "fs";
import { join } from "path";

const brew = "/usr/local/bin/brew";
const logPath = join(__dirname, "../log.txt");
export default function greet(args: string[]) {
    const proc = spawn(brew, args, { shell: "/bin/zsh", stdio: "inherit" });

    // proc.stdout.on("data", (b) => {
    //   writeFile(logPath, b.toString(), (e) => {
    //     console.error(e);
    //   });
    // });
    // process.stdin.pipe(proc.stdin);
    // proc.stdout.pipe(process.stdout);
    // proc.stderr.pipe(process.stderr);

      proc.on("exit", process.exit);
}
