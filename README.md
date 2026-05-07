# DevOps Platform — Production-Grade EKS Deployment

![CI - Build & Push](https://github.com/Joshuche22/devops-platform/actions/workflows/ci.yml/badge.svg)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.32-326CE5?logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?logo=terraform&logoColor=white)
![AWS EKS](https://img.shields.io/badge/AWS-EKS-FF9900?logo=amazonaws&logoColor=white)

A production-grade DevOps platform demonstrating end-to-end CI/CD — from code commit to live deployment on AWS EKS. Built with Terraform, GitHub Actions, Docker, and Kubernetes.

## Demo Recording

**[Watch the full project walkthrough on Loom](https://www.loom.com/share/5e6d409ccca244a6860e035de69ed058)**

The recording covers the live GitHub Actions pipeline, ECR image registry, and the running API on AWS EKS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Application | Node.js 20, Express |
| Testing | Jest |
| Containerisation | Docker (multi-stage build, non-root user) |
| CI/CD | GitHub Actions |
| Infrastructure | Terraform (VPC, EKS, ECR, IAM modules) |
| Container Registry | Docker Hub, Amazon ECR |
| Orchestration | AWS EKS (Kubernetes 1.32) |
| Networking | AWS VPC, Subnets, NAT Gateway, Load Balancer |
| Observability | Prometheus-format /metrics endpoint |
| IaC State | S3 + DynamoDB |

---

## Pipeline

The GitHub Actions pipeline runs automatically on every push to main:

1. Run Tests - Jest test suite validates the API before anything is built
2. Build and Push - Docker image built and pushed to Docker Hub, tagged by commit SHA
3. Deploy to EKS - Kubernetes rolling update applied to live cluster when AWS credentials are configured

---

## Infrastructure

Provisioned with Terraform across modular, environment-split configurations:

- VPC - Custom VPC with public/private subnets across 2 AZs, NAT Gateway
- EKS - Managed Kubernetes 1.32 cluster with auto-scaling node group (t3.medium)
- ECR - Private container registry with image scanning and lifecycle policies
- IAM - Scoped roles for EKS node groups and OIDC-federated CI access

---

## Live Cluster Evidence

The cluster was live during the recorded demo. Infrastructure has since been decommissioned to avoid ongoing AWS costs. The Loom recording shows the live nodes, running pods, and the API responding via AWS Load Balancer.

To redeploy the full stack, run terraform apply in infra/environments/dev.

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| /health | GET | Health check - returns status and timestamp |
| /metrics | GET | Prometheus-format metrics |
| /ready | GET | Readiness probe for Kubernetes |

---

## Author

**Benedict Korie** - DevOps and Cloud Engineer
GitHub: https://github.com/Joshuche22
LinkedIn: https://linkedin.com/in/benedict-chijindu-korie-4b29a837b

---

## Git Workflow

This repository follows a trunk-based development workflow with branch protection enforced on main.

- All changes are developed on feature branches (feature/description)
- A pull request is raised and must be reviewed and approved before merging
- Direct pushes to main are blocked by branch protection rules
- Commit messages follow the Conventional Commits standard (feat, fix, docs, chore)

This mirrors the workflow used in professional engineering teams.
