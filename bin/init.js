const fs = require('fs-extra');
const chalk = require('chalk');
const {basename, join} = require('path');
const readLine = require('readline');
const download = require('download-git-repo');
const ora = require('ora');
const vfs = require('vinyl-fs');
const map = require('map-stream');

const common = require('./common');
const {message, write} = common;

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

// download-git-repo 的下载函数的第一个参数，即模板项目在GitHub的名称
const template = 'BarryLiu1995/front-end-project-standard-demo';

// 下载模板项目到新创建项目的目标路径
const boilerplatePath = join(__dirname, '../boilerplate');

function copyLog(file, cb) {
  message.success(file.path);
  cb(null, file);
}

// 新建项目完成
function initComplete(app) {
  message.success(`Success! Created ${app} project complete!`);
  message.light(`begin by typing:

    cd ${app}
    npm start
    
    `)
  process.exit();
}

// 修改对应的JSON文件有关项目名称属性
function modifyJSON(dest, fileName) {
  const app = basename(dest);
  const filePath = `${dest}/${fileName}`;
  const modifiedFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (fileName === 'package.json' || fileName === 'package-lock.json') {
    modifiedFile.name = `${app}`;
  } else if (fileName === 'angular.json') {
    modifiedFile.defaultProject = `${app}`;
    modifiedFile.projects[`${app}`] = modifiedFile.projects['front-end-project-standard-demo'];
    modifiedFile.projects[`${app}-e2e`] = modifiedFile.projects['front-end-project-standard-demo-e2e'];
    delete modifiedFile.projects['front-end-project-standard-demo'];
    delete modifiedFile.projects['front-end-project-standard-demo-e2e'];

    modifiedFile.projects[`${app}`].architect.build.options.outputPath = `dist/${app}`;
    modifiedFile.projects[`${app}`].architect.serve.options.browserTarget = `${app}:build`;
    modifiedFile.projects[`${app}`].architect.serve.configurations.production.browserTarget = `${app}:build:production`;
    modifiedFile.projects[`${app}`].architect.serve.configurations.staging.browserTarget = `${app}:build:staging`;
    modifiedFile.projects[`${app}`].architect.serve.configurations.hmr.browserTarget = `${app}:build:hmr`;
    modifiedFile.projects[`${app}`].architect['extract-i18n'].options.browserTarget = `${app}:build`;

    modifiedFile.projects[`${app}-e2e`].architect.e2e.options.devServerTarget = `${app}:serve`;
    modifiedFile.projects[`${app}-e2e`].architect.e2e.configurations.production.devServerTarget = `${app}:serve:production`;
  }
  write(filePath, JSON.stringify(modifiedFile, null, 2));
}

// 创建项目
function createProject(dest) {
  const spinner = ora('downloading template ......');
  spinner.start();
  if (fs.pathExistsSync(boilerplatePath)) {
    fs.emptyDirSync(boilerplatePath);
  }
  download(template, boilerplatePath, function (err) {
    spinner.stop();
    if (err) {
      console.log(err);
      process.exit();
    }

    fs
      .ensureDir(dest)
      .then(() => {
        vfs
          .src(['**/*', '!node_modules/**/*'], {
            cwd: boilerplatePath,
            cwdbase: true,
            dot: true
          })
          .pipe(map(copyLog))
          .pipe(vfs.dest(dest))
          .on('end', function () {
            modifyJSON(dest, 'package-lock.json');
            modifyJSON(dest, 'package.json');
            modifyJSON(dest, 'angular.json');
            message.info('run install packages');
            require('./install')({
              success: initComplete.bind(null, basename(dest)),
              cwd: dest
            });
          })
          .resume();
      })
      .catch(err => {
        console.log(err);
        process.exit();
      })
  })
}

function init({app}) {
  // 命令行进程当前所在的工作目录
  const dest = process.cwd();
  // 新建项目的文件夹地址
  const appDir = join(dest, `./${app}`);
  // 判断文件夹是否已存在
  if (fs.pathExistsSync(appDir)) {
    rl.question(
      chalk.blue(`${app} dir exist! Do you want clear this dir? (Y/N)`),
      str => {
        // 获取用户命令行输入答案
        const answer = str && str.trim().toUpperCase();
        if (answer === 'Y') {
          const spinner = ora(`remove ${app} dir`).start();
          // 清空已存在文件夹内的所有文件
          fs
            .emptyDir(appDir)
            .then(() => {
              spinner.stop();
              createProject(appDir);
            })
            .catch(err => {
              console.error(err);
            });
        } else if (answer === 'N') {
          process.exit();
        } 
      }
    );
  } else {
    createProject(appDir);
  }
}

module.exports = init;
