FROM ubuntu:14.04.3
RUN apt-get update && apt-get install -y mysql-server

RUN grep -v bind-address /etc/mysql/my.cnf > temp.txt \
  && mv temp.txt /etc/mysql/my.cnf

EXPOSE 3306

CMD /etc/init.d/mysql start && tail -F /var/log/mysql.log



docker run -d --network dblink -e MYSQL_ROOT_PASSWORD=qu%rK1ness -e MYSQL_DATABASE=users mysql/mysql-server


RUN -d --network dblink 