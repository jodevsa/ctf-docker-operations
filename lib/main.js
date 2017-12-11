import Table from 'cli-table';
import Docker from 'dockerode';
const docker = new Docker({Promise: Promise, socketPath: '/var/run/docker.sock'});
import fuzzy from 'fuzzy';
const stdin = process.openStdin();
import inquirer from 'inquirer';
import Loader from './loader';
import util from 'util';
import chalk from 'chalk';
import figlet from 'figlet'
const drawer = util.promisify(figlet.text)
import Container from './container';
const images = []
const vorpal = require('vorpal')();
import singleLineLog from 'single-line-log';
const log=singleLineLog.stdout;
let containers = [];

////////////////////////////////////////////////////////////////////////
async function main() {
  console.log(chalk.cyan(await drawer("CTF Operations")));
  vorpal.command('list containers', 'Outputs "bar".').action(async function(args, next) {
    const images = await docker.listImages();
    images.map((element) => {
      this.log(element.RepoTags.join('.'))

    })

    next();
  });
  vorpal.command("hang", 'stop all containers').action(async function(args, next) {
    docker.listContainers(function(err, containers) {
      containers.forEach(function(containerInfo) {
        docker.getContainer(containerInfo.Id).stop(next);
      });
    });
  });
  ///////// clear ////
  vorpal.command('clear').action(async (args, cb) => {
    process.stdout.write("\u001B[2J\u001B[0;0f");
    console.log(chalk.cyan(await drawer("CTF Operations")));
    cb()

  });
  //////////////////////////////
  vorpal.command("list", 'list running container').action(async function(args, next) {

    const table = new Table({
      head: [
        'Challenge',
        'PORT',
        'Running',
        'Reset interval',
        'Auto Restart',
        'last Restart'
      ]
    });
    for (let container of containers) {
      const time = new Date();
      const timeDiff = String(Math.ceil((time - container.lastRestart) / 1000)) + " seconds";
      const lastRestart = String(container.restartInterval / 1000) + " seconds";
      table.push([
        container.name,
        container.port,
        container.running,
        lastRestart,
        container.autoRestart,
        timeDiff
      ]);
    }
    console.log(table.toString());
    next();
  })

  vorpal.command("live", 'list running container').action(async function(args, next) {
    process.stdout.write("\u001B[2J\u001B[0;0f");
    console.log(chalk.cyan(await drawer("CTF Operations")));
    let interval=setInterval(async()=>{
      const table = new Table({
        head: [
          'Challenge',
          'PORT',
          'Running',
          'Reset interval',
          'Auto Restart',
          'last Restart'
        ]
      });
      for (let container of containers) {
        const time = new Date();
        const timeDiff = String(Math.ceil((time - container.lastRestart) / 1000)) + " seconds";
        const lastRestart = String(container.restartInterval / 1000) + " seconds";
        table.push([
          container.name,
          container.port,
          container.running,
          lastRestart,
          container.autoRestart,
          timeDiff
        ]);
      }
      log(table.toString())
    },2000)
    stdin.once('keypress', (chunk, key)=>{
      clearInterval(interval);
      log.clear();
      process.stdout.write("\u001B[2J\u001B[0;0f");
      console.log(chalk.cyan(await drawer("CTF Operations")));
      next();

});


  })

  vorpal.command("stop [strings...]", 'adding an image to restarter').action(async (args, next) => {
    const containerName = String(args.strings[0]);
    for (let container of containers) {
      if (container.name === containerName) {
        await container.stop({StopTimeout: 2});

      }
    }
  }).autocompletion(async function(text, iteration, cb) {
    const results = fuzzy.filter(text || '', containers.map(function(value, index) {
      return value.name;
    }));
    if (results.length == 1) {
      cb(void 0, "stop " + results.map(function(val) {
        return val.original
      }).join(' '));
    } else {
      cb(void 0, results.map(function(val) {
        return val.original
      }))
    }

  });
  ///

  vorpal.command("interval [strings...]", 'adding an image to restarter').action(async (args, next) => {
    const containerName = String(args.strings[0]);
    const newInterval = (args.strings[1] || 1) * 1000;
    for (let container of containers) {
      if (container.name === containerName) {
        container.restartInterval = newInterval;

      }
    }
  }).autocompletion(async function(text, iteration, cb) {
    const results = fuzzy.filter(text || '', containers.map(function(value, index) {
      return value.name;
    }));
    if (results.length == 1) {
      cb(void 0, "interval " + results.map(function(val) {
        return val.original
      }).join(' '));
    } else {
      cb(void 0, results.map(function(val) {
        return val.original
      }))
    }

  })
  vorpal.command("start [strings...]", 'adding an image to restarter').action(async (args, next) => {
    const containerName = String(args.strings[0]);
    for (let container of containers) {
      if (container.name === containerName) {
        container.start();

      }
    }

  }).autocompletion(async function(text, iteration, cb) {
    const results = fuzzy.filter(text || '', containers.map(function(value, index) {
      return value.name;
    }));
    if (results.length == 1) {
      cb(void 0, "start " + results.map(function(val) {
        return val.original
      }).join(' '));
    } else {
      cb(void 0, results.map(function(val) {
        return val.original
      }))
    }

  });
  vorpal.command("add [strings...]", 'adding an image to restarter').action(async function(args, next) {
    const port = String(args.strings[1]);
    const timeout = (args.strings[2] || 1) * 1000;
    const image = args.strings[0];
    let container = new Container(image, port, timeout);
    container.start();
    containers.push(container);
    next();
  }).autocompletion(async function(text, iteration, cb) {
    const images = await docker.listImages();
    const results = fuzzy.filter(text || '', images.map(function(value, index) {
      return value['RepoTags'].join('.');
    }));
    if (results.length == 1) {
      cb(void 0, "add " + results.map(function(val) {
        return val.original
      }).join(' '));
    } else {
      cb(void 0, results.map(function(val) {
        return val.original
      }))
    }

  });

  vorpal.delimiter(chalk.blue('CTF$')).show();
}
main();
