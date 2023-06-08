if [ -n VERCEL_URL ]; then
  echo "BASE_URL=https://$VERCEL_URL" >> .env
fi