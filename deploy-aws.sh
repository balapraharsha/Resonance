#!/bin/bash

# Resonance AWS Deployment Script
# This script automates deployment to AWS

set -e

echo "🚀 Resonance AWS Deployment Script"
echo "===================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   https://aws.amazon.com/cli/"
    exit 1
fi

echo "✅ AWS CLI found"

# Check if user is logged in
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Not logged into AWS. Run: aws configure"
    exit 1
fi

echo "✅ AWS credentials configured"
echo ""

# Deployment options
echo "Select deployment method:"
echo "1) AWS Amplify (Frontend) + Elastic Beanstalk (Backend)"
echo "2) EC2 Instance (Both)"
echo "3) Docker on EC2"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying to AWS Amplify + Elastic Beanstalk"
        echo ""
        
        # Build frontend
        echo "Building frontend..."
        cd frontend
        npm run build
        
        # Create S3 bucket for frontend
        BUCKET_NAME="resonance-frontend-$(date +%s)"
        aws s3 mb s3://$BUCKET_NAME
        
        # Upload build to S3
        aws s3 sync dist/ s3://$BUCKET_NAME --acl public-read
        
        # Enable static website hosting
        aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html
        
        echo "✅ Frontend deployed to: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
        
        # Deploy backend to Elastic Beanstalk
        cd ../backend
        
        if ! command -v eb &> /dev/null; then
            echo "Installing Elastic Beanstalk CLI..."
            pip install awsebcli --break-system-packages
        fi
        
        echo "Initializing Elastic Beanstalk..."
        eb init -p node.js -r us-east-1 resonance-api
        
        echo "Creating environment..."
        eb create resonance-api-prod
        
        echo "Deploying backend..."
        eb deploy
        
        # Get EB URL
        EB_URL=$(eb status | grep "CNAME" | awk '{print $2}')
        
        echo ""
        echo "✅ Deployment complete!"
        echo "Frontend: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
        echo "Backend: http://$EB_URL"
        echo ""
        echo "⚠️  Update frontend to use backend URL:"
        echo "   Update API_URL in frontend code to: http://$EB_URL"
        ;;
        
    2)
        echo ""
        echo "📦 Deploying to EC2 Instance"
        echo ""
        
        # Create EC2 instance
        echo "Creating EC2 instance..."
        
        INSTANCE_ID=$(aws ec2 run-instances \
            --image-id ami-0c55b159cbfafe1f0 \
            --instance-type t2.micro \
            --key-name resonance-key \
            --security-groups resonance-sg \
            --query 'Instances[0].InstanceId' \
            --output text)
        
        echo "Waiting for instance to be running..."
        aws ec2 wait instance-running --instance-ids $INSTANCE_ID
        
        PUBLIC_IP=$(aws ec2 describe-instances \
            --instance-ids $INSTANCE_ID \
            --query 'Reservations[0].Instances[0].PublicIpAddress' \
            --output text)
        
        echo "✅ EC2 instance created: $PUBLIC_IP"
        echo ""
        echo "SSH into your instance and run setup:"
        echo "   ssh -i resonance-key.pem ubuntu@$PUBLIC_IP"
        echo ""
        echo "Then follow the manual EC2 setup steps in README.md"
        ;;
        
    3)
        echo ""
        echo "📦 Deploying Docker to EC2"
        echo ""
        
        # Build Docker images
        echo "Building Docker images..."
        docker-compose build
        
        # Push to ECR
        echo "Pushing to Amazon ECR..."
        
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        AWS_REGION="us-east-1"
        
        # Create ECR repositories
        aws ecr create-repository --repository-name resonance-frontend || true
        aws ecr create-repository --repository-name resonance-backend || true
        
        # Login to ECR
        aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
        
        # Tag and push images
        docker tag resonance-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-frontend:latest
        docker tag resonance-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-backend:latest
        
        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-frontend:latest
        docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/resonance-backend:latest
        
        echo "✅ Docker images pushed to ECR"
        echo ""
        echo "Next steps:"
        echo "1. Launch EC2 instance with Docker installed"
        echo "2. Pull images from ECR"
        echo "3. Run: docker-compose up -d"
        ;;
        
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment script complete!"
