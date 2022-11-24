ln -sf $(dirname -- "$(realpath -- $0;)";)/dashboardiot /etc/nginx/sites-enabled/dashboardiot
sudo systemctl restart nginx.service