import subprocess
import os
import sys

def generate_docker_compose(db_name, collections_and_files):
    services = []
    for idx, (collection_name, json_file_path) in enumerate(collections_and_files):
        json_file_path = os.path.abspath(json_file_path)
        service_name = f"mongo-seed-{idx}"
        service = f"""
  {service_name}:
    image: mongo:latest
    volumes:
      - {json_file_path}:/datasets/dataset{idx}.json
    command: mongoimport --host mongodb -d {db_name} -c {collection_name} --type json --file /datasets/dataset{idx}.json --jsonArray
    depends_on:
      - mongodb
"""
        services.append(service)
    
    docker_compose_template = f"""
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
{"".join(services)}
"""
    
    with open("docker-compose.yml", "w") as f:
        f.write(docker_compose_template)

def start_container():
    subprocess.run(["docker-compose", "up", "-d"])

if __name__ == "__main__":
    if len(sys.argv) < 4 or len(sys.argv) % 2 != 0:
        print("Usage: python script.py <db_name> <collection_name1> <json_file_path1> [<collection_name2> <json_file_path2> ...]")
        sys.exit(1)

    db_name = sys.argv[1]
    collections_and_files = list(zip(sys.argv[2::2], sys.argv[3::2]))
    
    generate_docker_compose(db_name, collections_and_files)
    start_container()
