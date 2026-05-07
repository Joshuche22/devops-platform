# DevOps Platform — Production-Grade EKS Deployment

![CI - Build & Push](https://github.com/Joshuche22/devops-platform/actions/workflows/ci.yml/badge.svg)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.32-326CE5?logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?logo=terraform&logoColor=white)
![AWS EKS](https://img.shields.io/badge/AWS-EKS-FF9900?logo=amazonaws&logoColor=white)

A production-grade DevOps platform demonstrating end-to-end CI/CD — from code commit to live deployment on AWS EKS. Built with Terraform, GitHub Actions, Docker, and Kubernetes.

## 🎥 Demo Recording

**[Watch the full project walkthrough on Loom](https://www.loom.com/share/5e6d409ccca244a6860e035de69ed058)**

The recording covers the live GitHub Actions pipeline, ECR image registry, and the running API on AWS EKS.

---

## Architecture

```
Developer Push
│
▼
GitHub Actions CI/CD Pipeline
│
├── 1. Run Tests (Jest)                     ~10s
│
├── 2. Build & Push Docker Image            ~40s
│         ├── Docker Hub (public)
│         └── Amazon ECR (private)
│
└── 3. Deploy to AWS EKS                    ~30s
          └── Live API via AWS Load Balancer
```

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
| Auth | AWS IAM + OIDC (keyless CI authentication) |
| IaC State | S3 + DynamoDB |

---

## Project Structure

```
devops-platform/
├── app/                    # Node.js metrics API
│   ├── src/
│   │   ├── index.js
│   │   └── app.js
│   ├── tests/
│   │   └── app.test.js
│   └── Dockerfile
├── infra/                  # Terraform infrastructure
│   ├── modules/
│   │   ├── vpc/
│   │   ├── eks/
│   │   └── ecr/
│   └── environments/
│       └── dev/
├── k8s/                    # Kubernetes manifests
│   └── deployment.yml
└── .github/
    └── workflows/
        └── ci.yml
```

---

## Pipeline

The GitHub Actions pipeline runs automatically on every push to `master`:

1. **Run Tests** — Jest test suite validates the API before anything is built
2. **Build & Push** — Multi-stage Docker image built and pushed to Docker Hub and ECR, tagged by commit SHA
3. **Deploy to EKS** — Kubernetes rolling update applied to live cluster (zero downtime)

Pipeline authenticates to AWS using OIDC federation — no long-lived credentials stored in GitHub secrets.

---

## Infrastructure

Provisioned with Terraform across modular, environment-split configurations:

- **VPC** — Custom VPC with public/private subnets across 2 AZs, NAT Gateway
- **EKS** — Managed Kubernetes 1.32 cluster with auto-scaling node group (t3.medium)
- **ECR** — Private container registry with image scanning and lifecycle policies
- **IAM** — Scoped roles for EKS node groups and OIDC-federated CI access

---

## Live Cluster Evidence

```bash
$ kubectl get nodes
NAME                                       STATUS   ROLES    AGE   VERSION
ip-10-0-3-241.eu-west-2.compute.internal   Ready    <none>   11h   v1.32.13-eks-40737a8
ip-10-0-4-175.eu-west-2.compute.internal   Ready    <none>   11h   v1.32.13-eks-40737a8

$ kubectl get pods
NAME                                  READY   STATUS    RESTARTS   AGE
devops-metrics-api-5f9d47f485-2m5ss   1/1     Running   0          10h
devops-metrics-api-5f9d47f485-pq8jg   1/1     Running   0          10h

$ kubectl get svc
NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP                                                              PORT(S)
devops-metrics-api   LoadBalancer   172.20.74.251   aa7dfb882474b49bb8b1729398d12dc4-280349195.eu-west-2.elb.amazonaws.com   80:30243/TCP
```

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check — returns status and timestamp |
| `/metrics` | GET | Prometheus-format metrics |
| `/ready` | GET | Readiness probe for Kubernetes |

---

## Live Demo

The API is deployed and accessible via AWS Load Balancer (eu-west-2, London).

```bash
curl http://aa7dfb882474b49bb8b1729398d12dc4-280349195.eu-west-2.elb.amazonaws.com/health
```

```json
{"status":"healthy","timestamp":"2026-05-06T09:40:18.685Z"}
```

---

## Author

**Benedict Korie** — DevOps & Cloud Engineer
[GitHub](https://github.com/Joshuche22) | [LinkedIn](https://linkedin.com/in/benedict-korie)
## Git Workflow

This repository follows a trunk-based development workflow with branch protection enforced on `main`.

- All changes are developed on feature branches (`feature/<description>`)
- A pull request is raised and must be reviewed and approved before merging
- Direct pushes to `main` are blocked by branch protection rules
- Commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) standard (`feat:`, `fix:`, `docs:`, `chore:`)

This mirrors the workflow used in professional engineering teams.