import React from 'react';
import { Modal, Box, Typography, Button, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { X, Keyboard, MousePointerClick, Smartphone, BookOpen } from 'lucide-react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};

const HelpModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, pb: 1 }}>
                    <Typography variant="h5" component="h2" fontWeight="700">
                        Hogyan használd?
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>

                <List sx={{ pt: 0 }}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 44, mt: 0.5 }}>
                            <MousePointerClick size={24} color="#6366f1" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Kártya megfordítása"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondary="Kattints a kártyára vagy nyomd meg a 'Válasz megtekintése' gombot."
                        />
                    </ListItem>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 44, mt: 0.5 }}>
                            <BookOpen size={24} color="#6366f1" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Témakör váltása"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondary="Kattints a 'Témakörök' gombra a fejlécben más CSV fájlok betöltéséhez."
                        />
                    </ListItem>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 44, mt: 0.5 }}>
                            <Keyboard size={24} color="#6366f1" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Billentyűzet"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondary="Használd a Space-t a fordításhoz, a nyilakat a léptetéshez."
                        />
                    </ListItem>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 44, mt: 0.5 }}>
                            <Smartphone size={24} color="#6366f1" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Mobil használat"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondary="Legyints balra a következő, jobbra az előző kártyához. Érintsd meg a kártyát bárhol a fordításhoz."
                        />
                    </ListItem>
                </List>

                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Button onClick={onClose} variant="contained">
                        Értem
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default HelpModal;
