# Cortex Frontend

## Requirements

- Connections to Cortex Components must be proxied with the appropriate CORS headers setup; for example we're using HAProxy with the CORS LUA Library (https://github.com/haproxytech/haproxy-lua-cors)
). Since Cortex components respond to HTTP OPTIONS with a 405 Method not allowed, this library will intercept browser preflight requests without ever forwarding it to the backend server
- Configure `ruler_url`, `distributor_url` & `alertmanager_url` in `src/environments/environment.prod.ts` with your environment settings
## Overview
This is a basic Angular frontend designed to ease the configuration of Tenant Alerting & Recording rules against the Cortex ruler as well as configuring Tenant AlertManager configuration.
## Current Features

Ruler:
 - Creation of rule groups for tenants
 - Editing of existing rule groups for tenants
 - Removal of rule groups for tenants
 - Exporting of rule groups for tenants

AlertManager:
 - Creation of AlertManager config for tenants
 - Editing of AlertManager config for tenants
 - Removal of AlertManager config for tenants
 
## Planned Features
  - Distributor HA Tracker interface
  - Ingester Ring Status (And potentially flush/shutdown of ingesters)
  - Ruler Ring Status
  - Store-Gateway Ring Status
  - Compactor Ring Status
 

## Installation

1. Clone this repository `git clone <git_url>`
2. `cd <repository_directory>`
3. Configure `ruler_url`, `distributor_url` & `alertmanager_url` in `src/environments/environment.prod.ts` with your environment settings
4. Build the docker image `docker build`
5. Tag the image `docker tag <image_id> <registry>/<image_name>:<version>`
6. Push the image `docker push <registry>/<image_name>:<version>`
7. Run the image using `docker run -d -p 8080:80 <registry>/<image_name>:<version>`


## Kubernetes Deployment

1. Update `deployment.yml` and `service.yml` and replace `{{NAMESPACE}}` with the namespace you'd like this deployed in
2. Update `deployment.yml` and update the `image:` tag under `containers` with what you used in step 5 of `Installation`
3. Done. Remember if you want to expose this outside of your kubernetes cluster you must have an Ingress Controller (https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) and an ingress rule setup (https://kubernetes.io/docs/concepts/services-networking/ingress/) 
