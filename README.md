# ngain-cli

## Description

Based on past development experiences, I have encapsulated an Angular project template for use by companies and their individual projects. In order to avoid the repetitive work of `git clone`, `npm install` and manually modifying the project name-related field values in some configuration files of the project, the scaffolding tool was developed.

> ngain = ng + gain

It can be seen from the naming that the scaffolding tool can generate the Angular front-end project template and directly enter the business development stage, eliminating the need for the initial configuration of the project development and the preparation of the common code.



## Usage

### Install

```powershell
npm i ngain-cli -g
```



### Create New Project

```powershell
ngain new|n [projectName]
```

or

```powershell
npx ngain new|n [projectName]
```

run the above command directly in the target directory without installing this scaffolding tool globally



### Version

```powershell
ngain -v
```

or

```powershell
npx ngain -v
```

run the above command directly in the root directory of project without installing this scaffolding tool globally



## Project Template

[BarryLiu1995/angular-project-template](https://github.com/BarryLiu1995/angular-project-template)
