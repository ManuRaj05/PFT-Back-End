pipeline {
    agent any

    environment {
        // Prepend Node.js directory to PATH so npm is always recognized
        PATH = "C:\\Program Files\\nodejs;${env.PATH}"
        NODE_ENV = 'test'
        MONGODB_URI = 'mongodb+srv://project:project@manuraj05.quekw.mongodb.net/finance'
        JWT_SECRET = 'sgfbgtgrbasd'
        // Bind your Azure Service Principal credentials using the Jenkins credential ID
        AZURE_CREDENTIALS = credentials('87784565-ebc7-45f1-9979-e504aabe1942')
    }

    stages {
        stage('Check Azure CLI') {
            steps {
                bat 'where az'
            }
        }
        
        stage('Azure Login') {
            steps {
                script {
                    echo "Attempting Azure login..."
                    // Run the Azure login command and redirect the output to a file to avoid showing it in the console.
                    bat 'az login --service-principal -u %AZURE_CREDENTIALS_USR% -p %AZURE_CREDENTIALS_PSW% --tenant 6b8b8296-bdff-4ad8-93ad-84bcbf3842f5 -o json > azure-login-output.txt'
                    echo "Azure login completed. (Output saved to azure-login-output.txt and not displayed)"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build and tests succeeded!'
        }
        failure {
            echo 'Build or tests failed.'
        }
    }
}
