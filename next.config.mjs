/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[{hostname:"images.pexels.com"}],
     domains: ['res.cloudinary.com'], // agrega aquí el dominio externo

    },
};

export default nextConfig;
