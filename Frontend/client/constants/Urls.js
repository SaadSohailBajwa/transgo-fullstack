
const Urls = {
  auth: `${process.env.AUTH_IP}:${process.env.AUTH_PORT}`,
  user: `${process.env.AUTH_IP}:${process.env.USER_PORT}`,
  driver: `${process.env.AUTH_IP}:${process.env.DRIVER_PORT}`,
  nearest: `${process.env.AUTH_IP}:${process.env.NEAREST_PORT}`,
  s3: `${process.env.S3_IP}`,
}; 



export default Urls