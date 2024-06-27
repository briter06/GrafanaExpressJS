# Express JS application with Prometheus, Grafana and Elastic Search

* Run the following command to start the app, Prometheus, Elastic Search and Grafana

```sh
docker-compose up -d
```

## Grafana

* Grafana is available in http://localhost:3000
* Use `admin` as both the username and the password
* Set Prometheus as a data source with the endpoint `http://prometheus:9090`
* Set Elastic Search as a data source with the enpoint `http://elasticsearch:9200`
* You can create new dashboards with the Prometheus metrics
* You can query the logs using Lucene queries in the "Explore" tab