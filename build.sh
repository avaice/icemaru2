git pull origin
docker image prune
sudo docker image build -t avaice/icemaru2 ./ --network=host
docker run -d avaice/icemaru2