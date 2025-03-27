pipeline {
    agent any

    environment {
        // Ensure Node.js and Docker are in the PATH for all stages
        PATH = "C:\\Program Files\\nodejs;C:\\Program Files\\Docker;${env.PATH}"
        NODE_ENV = 'test'
        MONGODB_URI = 'mongodb+srv://project:project@manuraj05.quekw.mongodb.net/finance'
        JWT_SECRET = 'sgfbgtgrbasd'
        
        // Azure Service Principal credentials (for Azure CLI)
        AZURE_CREDENTIALS = credentials('87784565-ebc7-45f1-9979-e504aabe1942')
        
        // Docker registry and Azure App Service settings
        DOCKER_REGISTRY = 'docker.io'                          // Docker Hub registry
        IMAGE_NAME = 'manuraj05/my-express-app'                 // Your Docker Hub repository name
        AZURE_SUBSCRIPTION_ID = '7a1df7ae-3b27-4ef5-88b3-811a996d1a98'
        AZURE_RESOURCE_GROUP = 'PFT'
        AZURE_APP_SERVICE = 'pft-backend'
        
        // Docker registry credentials (stored as Jenkins credentials)
        DOCKER_REGISTRY_CREDENTIALS = credentials('docker-registry-credentials')
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
                    // Log in using the Azure Service Principal; output is saved to a file
                    bat 'az login --service-principal -u %AZURE_CREDENTIALS_USR% -p %AZURE_CREDENTIALS_PSW% --tenant 6b8b8296-bdff-4ad8-93ad-84bcbf3842f5 -o json > azure-login-output.txt'
                    echo "Azure login completed. (Output saved to azure-login-output.txt)"
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
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Tag the Docker image with the registry URL, image name, and Jenkins build number
                    def imageTag = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    echo "Building Docker image: ${imageTag}"
                    bat "docker build -t ${imageTag} ."
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    def imageTag = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    echo "Logging into Docker registry..."
                    // Log into Docker Hub using the provided credentials
                    bat "docker login ${DOCKER_REGISTRY} -u %DOCKER_REGISTRY_CREDENTIALS_USR% -p %DOCKER_REGISTRY_CREDENTIALS_PSW%"
                    echo "Pushing Docker image: ${imageTag}"
                    bat "docker push ${imageTag}"
                }
            }
        }
        
        stage('Deploy to Azure App Service') {
            steps {
                script {
                    def imageTag = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    echo "Setting Azure subscription..."
                    bat "az account set --subscription %AZURE_SUBSCRIPTION_ID%"
                    
                    echo "Deploying new image to Azure App Service..."
                    bat """
                    az webapp config container set --resource-group %AZURE_RESOURCE_GROUP% --name %AZURE_APP_SERVICE% --docker-custom-image-name ${imageTag} --docker-registry-server-url https://${DOCKER_REGISTRY} --docker-registry-server-user %DOCKER_REGISTRY_CREDENTIALS_USR% --docker-registry-server-password %DOCKER_REGISTRY_CREDENTIALS_PSW%
                    """
                    echo "Deployment completed."
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build, tests, and deployment succeeded!'
        }
        failure {
            echo 'Build, tests, or deployment failed.'
        }
    }
}
