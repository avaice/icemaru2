sudo docker rm -f avaice/icemaru2
sudo docker rmi -f avaice/icemaru2
sudo docker image build -t avaice/icemaru2 ./ --network=host
docker run avaice/icemaru2