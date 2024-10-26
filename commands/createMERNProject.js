import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';

function checkNodeVersion() {
  const currentVersion = process.versions.node;
  const majorVersion = currentVersion.split('.')[0];
  if (majorVersion < 14) {
    console.error(
      `Your Node.js version (${currentVersion}) is not supported. Please use Node.js 14.x or higher.`
    );
    process.exit(1);
  }
}

export default function createMERNProjectCommand(program) {
  program
    .command('create <projectName>')
    .description('Create a new MERN project')
    .action((projectName) => {
      // Check Node.js version before proceeding
      checkNodeVersion();

      const rootDir = path.join(process.cwd(), projectName);

      // Create root project directory
      try {
        fs.mkdirSync(rootDir, { recursive: true });
        console.log('✅ Root directory created successfully.');
      } catch (error) {
        console.error(`❌ Failed to create root directory: ${error.message}`);
        process.exit(1);
      }

      console.log('📦 Creating backend app...');
      const backendDir = path.join(rootDir, 'backend');
      const dirsToCreate = [
        'controllers',
        'db',
        'middlewares',
        'models',
        'routes',
        'utils',
      ];

      try {
        fs.mkdirSync(backendDir, { recursive: true });
        dirsToCreate.forEach((dir) =>
          fs.mkdirSync(path.join(backendDir, dir), { recursive: true })
        );
        console.log('✅ Backend directory structure created.');
      } catch (error) {
        console.error(
          `❌ Failed to create backend directory structure: ${error.message}`
        );
        process.exit(1);
      }

      // Backend files creation
      try {
        fs.writeFileSync(
          path.join(backendDir, 'constants.js'),
          '// TODO: Add application-wide constants'
        );
        fs.writeFileSync(
          path.join(backendDir, 'server.js'),
          `// Entry point of the backend server
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('${projectName.toUpperCase()} BACKEND API');
});

// TODO: Add routes and middleware

app.listen(PORT, () => {
  console.log(\`Server is up and running at http://localhost:\${PORT} 🚀\`);
});`
        );
        fs.writeFileSync(
          path.join(backendDir, '.env.example'),
          `# Sample .env file for backend
PORT=5000
DB_URI=your_database_uri_here`
        );
        fs.writeFileSync(
          path.join(backendDir, '.gitignore'),
          `node_modules
.env`
        );
        fs.writeFileSync(
          path.join(backendDir, 'README.md'),
          `# ${projectName} Backend
This is the backend of the ${projectName} MERN project.

## Setup

- Install dependencies: \`npm install\`
- Start the development server: \`npm run dev\`

## Environment Variables

Create a \`.env\` file based on \`.env.example\`.`
        );
        fs.writeFileSync(
          path.join(backendDir, 'package.json'),
          JSON.stringify(
            {
              name: `${projectName}-backend`,
              version: '1.0.0',
              main: 'server.js',
              scripts: {
                start: 'node server.js',
                dev: 'nodemon server.js',
              },
              dependencies: {
                express: '^4.21.1',
                mongoose: '^8.7.1',
                cors: '^2.8.5',
                dotenv: '^16.4.5',
              },
              devDependencies: {
                nodemon: '^3.1.7',
              },
            },
            null,
            2
          )
        );

        // BACKEND DOCKERFILE
        // fs.writeFileSync(path.join(backendDir, 'Dockerfile'),
        //   `FROM node:20-alpine

        // WORKDIR /app

        // COPY package* .

        // RUN npm install

        // COPY . .

        // EXPOSE 5000

        // CMD ['npm', "run","dev"]`
        // )
        // console.log("✨ Dockerfile created in /frontend")
        console.log('✅ Backend files created successfully.');
      } catch (error) {
        console.error(`❌ Failed to create backend files: ${error.message}`);
        process.exit(1);
      }

      // Initialize Git in backend
      console.log('🔧 Initializing Git repository in backend...');
      try {
        execSync(`git init "${backendDir}"`, { stdio: 'inherit' });
        console.log('✅ Git repository initialized in backend.');
      } catch {
        console.warn(
          '⚠️ Git is not installed or an error occurred. Skipping Git initialization.'
        );
      }

      // Install backend dependencies
      console.log('📦 Installing backend dependencies...');
      try {
        execSync('npm install', { cwd: backendDir, stdio: 'inherit' });
        console.log('✅ Backend dependencies installed.');
      } catch (error) {
        console.error(
          `❌ Failed to install backend dependencies: ${error.message}`
        );
        process.exit(1);
      }

      // Create frontend using create-react-app
      console.log('📦 Creating React frontend app...');
      const frontendDir = path.join(rootDir, 'frontend');
      try {
        execSync(`npx create-react-app "${frontendDir}"`, { stdio: 'inherit' });
        console.log('✅ React frontend created successfully.');
      } catch (error) {
        console.error(`❌ Failed to create React app: ${error.message}`);
        process.exit(1);
      }

      // Create frontend .env.example and dockerfile
      try {
        fs.writeFileSync(
          path.join(frontendDir, '.env.example'),
          `# Sample .env file for frontend
REACT_APP_API_URL=http://localhost:5000/api`
        );
        console.log('✅ Frontend .env.example file created.');

        // FRONTEND DOCKERFILE
        //         fs.writeFileSync(path.join(frontendDir, "Dockerfile"),
        //           `# Use the official Node.js image
        // FROM node:20-alpine

        // # Set the working directory
        // WORKDIR /app

        // # Copy package.json and package-lock.json
        // COPY package*.json ./

        // # Install dependencies
        // RUN npm install

        // # Copy the rest of the application files
        // COPY . .

        // # Expose the port
        // EXPOSE 3000

        // # Start the application in development mode
        // CMD ["npm", "start"]`
        //         )
        console.log('✨ Dockerfile created in /frontend');
      } catch (error) {
        console.error(
          `❌ Failed to create frontend .env.example file: ${error.message}`
        );
        process.exit(1);
      }

      // Create docker-compose.yml in the root directory
      //       try {
      //         fs.writeFileSync(
      //           path.join(rootDir, "docker-compose.yml"),
      //           `# version: "3.8"

      // services:
      //   backend:
      //     build: ./backend
      //     ports:
      //       - "5000:5000"
      //     volumes:
      //       - ./backend:/app
      //     environment:
      //       DB_URL: mongodb://mongo:27017/mydatabase # you can change db name here to your liking
      //       # this doesnt work since for that we need .env on same level
      //       # DB_URL: mongodb://mongo:27017/${DB_NAME}

      //   frontend:
      //     build: ./frontend
      //     ports:
      //       - "3000:3000"
      //     volumes:
      //       - ./frontend:/app
      //     environment:
      //       REACT_APP_API_URL: http://localhost:5000/api
      //     depends_on:
      //       - backend # Ensure the backend is started before the frontend

      //   mongo:
      //     image: mongo:latest
      //     ports:
      //       - "27017:27017"
      //     volumes:
      //       - mongo_data:/data/db

      // volumes:
      //   mongo_data:`
      //         );
      //         console.log("✨ docker-compose.yml created successfully.");
      //       } catch (error) {
      //         console.error(`❌ Failed to create docker-compose.yml: ${error.message}`);
      //         process.exit(1);
      //       }

      // Final success message
      console.log(`\n🎉 MERN project "${projectName}" created successfully!`);

      console.log(
        `${chalk.green.bold('To get started:')}
  ${chalk.blue(`cd "${projectName}"`)}

${chalk.magenta.bold('Backend:')}
  ${chalk.blue('cd backend')}
  ${chalk.yellow('npm start')} ${chalk.cyan('or')} ${chalk.yellow(
    'npm run dev [nodemon]'
  )}

${chalk.magenta.bold('Frontend:')}
  ${chalk.blue('cd frontend')}
  ${chalk.yellow('npm start')}`
      );
    });
}
