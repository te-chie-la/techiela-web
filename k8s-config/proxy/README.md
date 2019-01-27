Manage DNS zone:

```
gcloud dns managed-zones create "external-dns-gcp-dev-chie-la" --dns-name "dev.chie.la." --description "Automatically managed zone by kubernetes.io/external-dns dev.chie.la"
```

```
$ gcloud dns record-sets list --zone "external-dns-gcp-dev-chie-la" --name "dev.chie.la." --type NS
NAME          TYPE  TTL    DATA
dev.chie.la.  NS    21600  ns-cloud-a1.googledomains.com.,ns-cloud-a2.googledomains.com.,ns-cloud-a3.googledomains.com.,ns-cloud-a4.googledomains.com.
```

```
gcloud container node-pools create adjust-scope --cluster te-chie-la-k8s-cluster --zone europe-west3-a --num-nodes 1 --scopes "default,https://www.googleapis.com/auth/ndev.clouddns.readwrite,https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append"
```