import React from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = "Adatok betöltése..." }) => {
    return (
        <Box
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#0f172a',
                color: 'white',
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
            }}
        >
            <Container maxWidth="xs" sx={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <Box
                        component="img"
                        src="/splash.png"
                        alt="Splash Screen"
                        sx={{
                            width: '100%',
                            maxWidth: { xs: 280, sm: 400 },
                            borderRadius: 4,
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            mb: 4,
                        }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 1, background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Tanulókártya
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Modern tanulási élmény
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={28} thickness={5} sx={{ color: '#6366f1' }} />
                        <Typography variant="body2" sx={{ letterSpacing: 1, opacity: 0.7 }}>
                            {message.toUpperCase()}
                        </Typography>
                    </Box>
                </motion.div>
            </Container>
        </Box>
    );
};

export default LoadingScreen;
