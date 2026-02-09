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
    outline: 'none',
};

const HelpModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2" fontWeight="700">
                        Hogyan használd?
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <MousePointerClick size={24} color="#6366f1" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Kártya megfordítása"
                            secondary="Kattints a kártyára vagy nyomd meg a 'Válasz megtekintése' gombot."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <BookOpen size={24} color="#6366f1" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Témakör váltása"
                            secondary="Kattints a 'Témakörök' gombra a fejlécben más CSV fájlok betöltéséhez."
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <Keyboard size={24} color="#6366f1" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Billentyűzet"
                            secondary="Használd a Space-t a fordításhoz, a nyilakat a léptetéshez."
                        />
                    </ListItem>
                    <ListItem>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Smartphone size={24} color="#6366f1" />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Mobil használat</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Legyints balra a következő, jobbra az előző kártyához. Érintsd meg a kártyát bárhol a fordításhoz.
                                </Typography>
                            </Box>
                        </Box>
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
