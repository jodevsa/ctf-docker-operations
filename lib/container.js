
import Docker from 'dockerode';
const docker = new Docker({Promise: Promise, socketPath: '/var/run/docker.sock'});

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)

  });
}
class ctfContainer {
  constructor(name, port, restartInterval) {
    this.running = false;
    this.autoRestart = true;
    this.name = name;
    this.port = String(port);
    this.lastRestart=new Date();
    this.restartInterval = restartInterval;
  }
  async start() {
  //  console.log("started")
    this._container = await docker.createContainer({
      PortBindings: {
        [this.port + "/tcp"]: [
          {
            "HostPort": this.port,
            "HostIP": "0.0.0.0"
          }
        ]
      },
      Image: this.name
    });
    this.running = true;
    this.autoRestart=true;
    await this._container.start();
    await sleep(this.restartInterval);
  //  console.log("timeout")
    if (this.autoRestart) {
      await this.restart();
    }
  }
  stopRestart() {
    this.autoRestart = false;
  }
  async restart() {

    if (this.running === false) {
      return reject("not even running !")
    }
  //  console.log("in restart")
    await this.stop();
    this.lastRestart=new Date();
  //  console.log("stopped");
    this.start();
  }
  forceRestart() {}
  async changeNextRestartInterval(interval) {
    await this.stop();
    this.restartInterval=interval;
    this.start();
  }
  async stop() {
    if (!this.running) {
      return;
    }
///    console.log("trying to stop!!!...")
    this.running = false;
    this.autoRestart=false;
  //  console.log("trying to stop!!!...")
    await this._container.kill();
   //console.log("stopped 62")
    await this._container.remove();
///    console.log("removed 64")

  }

}

export default ctfContainer;
