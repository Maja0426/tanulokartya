import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Button, IconButton, Paper, Stack, Tooltip, Menu, MenuItem } from '@mui/material';
import { ChevronLeft, ChevronRight, Shuffle, HelpCircle, BookOpen } from 'lucide-react';
import Papa from 'papaparse';
import Flashcard from './components/Flashcard';
import LoadingScreen from './components/LoadingScreen';
import HelpModal from './components/HelpModal';

// Hardcoded sources based on files in public/
const SOURCES = [
    { id: 'flashcards', label: 'Alap témakör', file: '/flashcards.csv' },
    { id: 'flashcards-2', label: '2. Témakör', file: '/flashcards-2.csv' },
    { id: 'flashcards-3', label: '3. Témakör', file: '/flashcards-3.csv' },
    { id: 'flashcards-4', label: '4. Témakör', file: '/flashcards-4.csv' },
];

const App = () => {
    const [allData, setAllData] = useState({}); // { sourceId: [cards] }
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("Kezelés indítása...");
    const [currentSource, setCurrentSource] = useState(SOURCES[0]);
    const [anchorEl, setAnchorEl] = useState(null);

    // Preload ALL CSV data at startup
    useEffect(() => {
        const preloadAllCSVs = async () => {
            setLoading(true);
            const loadedData = {};

            try {
                for (let i = 0; i < SOURCES.length; i++) {
                    const source = SOURCES[i];
                    setLoadingMessage(`${source.label} betöltése...`);

                    const response = await fetch(source.file);
                    if (!response.ok) throw new Error(`Hiba a fájl betöltésekor: ${source.file}`);

                    const text = await response.text();

                    // Parse the CSV text
                    const parsedCards = await new Promise((resolve, reject) => {
                        Papa.parse(text, {
                            header: false,
                            skipEmptyLines: true,
                            complete: (results) => {
                                if (results.errors.length > 0) {
                                    console.warn('PapaParse hibák:', results.errors);
                                }
                                const cards = results.data
                                    .map(row => ({
                                        question: row[0],
                                        answer: row[1]
                                    }))
                                    .filter(card => card.question && card.answer);
                                resolve(cards);
                            },
                            error: (err) => reject(err)
                        });
                    });

                    loadedData[source.id] = parsedCards;
                }

                setAllData(loadedData);
                // Artificial delay for better UX of the splash screen
                setLoadingMessage("Sikeres betöltés!");
                setTimeout(() => setLoading(false), 1000);
            } catch (error) {
                console.error('Hiba az adatok előtöltésekor:', error);
                setLoadingMessage("Hiba történt a betöltéskor.");
                // Still allow entry if some failed, or show error? 
                // For now, let's just proceed with whatever we have
                setAllData(loadedData);
                setTimeout(() => setLoading(false), 2000);
            }
        };

        preloadAllCSVs();
    }, []);

    const cards = allData[currentSource.id] || [];
    const currentCard = cards[currentIndex];

    const handleNext = useCallback(() => {
        if (!cards.length) return;
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    }, [cards.length]);

    const handlePrevious = useCallback(() => {
        if (!cards.length) return;
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    }, [cards.length]);

    const handleRandom = useCallback(() => {
        if (!cards.length) return;
        setIsFlipped(false);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * cards.length);
            setCurrentIndex(randomIndex);
        }, 150);
    }, [cards.length]);

    const handleFlip = useCallback(() => {
        setIsFlipped((prev) => !prev);
    }, []);

    const handleSourceChange = (source) => {
        setCurrentSource(source);
        setCurrentIndex(0);
        setIsFlipped(false);
        setAnchorEl(null);
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                handleFlip();
            } else if (event.code === 'ArrowRight') {
                handleNext();
            } else if (event.code === 'ArrowLeft') {
                handlePrevious();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleFlip, handleNext, handlePrevious]);

    if (loading) {
        return <LoadingScreen message={loadingMessage} />;
    }

    // Safety check in case of unexpected state
    if (!cards || cards.length === 0) {
        return (
            <LoadingScreen message="Kártyák előkészítése..." />
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                        Tanulókártya
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {currentSource.label} • {currentIndex + 1} / {cards.length} kártya
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                    <Tooltip title="Témakör választása">
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<BookOpen size={16} />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{
                                borderRadius: 2,
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                px: { xs: 1, sm: 2 },
                                minWidth: { xs: 'auto', sm: 120 }
                            }}
                        >
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Témakörök</Box>
                            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Témák</Box>
                        </Button>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{
                            sx: {
                                bgcolor: 'background.paper',
                                border: '1px solid rgba(255,255,255,0.1)',
                                minWidth: 200,
                            }
                        }}
                    >
                        {SOURCES.map((source) => (
                            <MenuItem
                                key={source.id}
                                onClick={() => handleSourceChange(source)}
                                selected={source.id === currentSource.id}
                                sx={{
                                    py: 1.5,
                                    '&.Mui-selected': { bgcolor: 'primary.dark' },
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                                }}
                            >
                                {source.label}
                            </MenuItem>
                        ))}
                    </Menu>

                    <Tooltip title="Súgó">
                        <IconButton onClick={() => setIsHelpOpen(true)} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                            <HelpCircle size={24} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Main Flashcard */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cards.length > 0 ? (
                    <Flashcard
                        question={currentCard.question}
                        answer={currentCard.answer}
                        isFlipped={isFlipped}
                        onFlip={handleFlip}
                    />
                ) : (
                    <Typography variant="h6" color="text.secondary">Nincsenek kártyák ebben a témakörben.</Typography>
                )}
            </Box>

            {/* Navigation Controls */}
            <Paper
                elevation={0}
                sx={{
                    mt: 6,
                    p: 2,
                    borderRadius: 4,
                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
            >
                <Stack direction="row" spacing={{ xs: 0.5, sm: 2 }} justifyContent="center" alignItems="center">
                    <IconButton onClick={handlePrevious} size="medium" sx={{ color: 'white' }}>
                        <ChevronLeft size={28} />
                    </IconButton>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleFlip}
                        disabled={cards.length === 0}
                        sx={{
                            px: { xs: 2, sm: 4, md: 8 },
                            minHeight: 56,
                            height: 'auto',
                            py: 1,
                            borderRadius: 3,
                            fontSize: { xs: '0.9rem', sm: '1.1rem' },
                            flexGrow: 1,
                            maxWidth: 400
                        }}
                    >
                        {isFlipped ? 'Kérdés' : 'Válasz megtekintése'}
                    </Button>

                    <IconButton onClick={handleNext} size="medium" sx={{ color: 'white' }}>
                        <ChevronRight size={28} />
                    </IconButton>

                    <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: 32, mx: 1 }} />

                    <Tooltip title="Véletlenszerű">
                        <IconButton onClick={handleRandom} color="primary" disabled={cards.length === 0}>
                            <Shuffle size={24} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Paper>

            <HelpModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </Container>
    );
};

export default App;
