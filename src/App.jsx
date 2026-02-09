import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Button, IconButton, Paper, Stack, Tooltip, Menu, MenuItem } from '@mui/material';
import { ChevronLeft, ChevronRight, Shuffle, HelpCircle, BookOpen } from 'lucide-react';
import Papa from 'papaparse';
import Flashcard from './components/Flashcard';
import HelpModal from './components/HelpModal';

// Hardcoded sources based on files in public/
const SOURCES = [
    { id: 'flashcards', label: 'Alap témakör', file: '/flashcards.csv' },
    { id: 'flashcards-2', label: '2. Témakör', file: '/flashcards-2.csv' },
    { id: 'flashcards-3', label: '3. Témakör', file: '/flashcards-3.csv' },
    { id: 'flashcards-4', label: '4. Témakör', file: '/flashcards-4.csv' },
];

const App = () => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentSource, setCurrentSource] = useState(SOURCES[0]);
    const [anchorEl, setAnchorEl] = useState(null);

    // Load CSV data
    useEffect(() => {
        const loadCSV = async () => {
            setLoading(true);
            try {
                const response = await fetch(currentSource.file);
                const reader = response.body.getReader();
                const result = await reader.read();
                const decoder = new TextDecoder('utf-8');
                const csv = decoder.decode(result.value);

                Papa.parse(csv, {
                    header: false,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsedCards = results.data.map(row => ({
                            question: row[0],
                            answer: row[1]
                        })).filter(card => card.question && card.answer);

                        setCards(parsedCards);
                        setCurrentIndex(0);
                        setIsFlipped(false);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error('Hiba a CSV betöltésekor:', error);
                setLoading(false);
            }
        };

        loadCSV();
    }, [currentSource]);

    const handleNext = useCallback(() => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    }, [cards.length]);

    const handlePrevious = useCallback(() => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    }, [cards.length]);

    const handleRandom = useCallback(() => {
        setIsFlipped(false);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * cards.length);
            setCurrentIndex(randomIndex);
        }, 150);
    }, [cards.length]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleSourceChange = (source) => {
        setCurrentSource(source);
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
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
                <Typography variant="h6" color="text.primary">Betöltés...</Typography>
            </Box>
        );
    }

    const currentCard = cards[currentIndex];

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

                <Stack direction="row" spacing={1}>
                    <Tooltip title="Témakör választása">
                        <Button
                            variant="outlined"
                            startIcon={<BookOpen size={18} />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{ borderRadius: 2, borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                        >
                            Témakörök
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
                <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <IconButton onClick={handlePrevious} size="large" sx={{ color: 'white' }}>
                        <ChevronLeft size={32} />
                    </IconButton>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleFlip}
                        disabled={cards.length === 0}
                        sx={{
                            px: { xs: 4, md: 8 },
                            height: 56,
                            borderRadius: 3,
                            fontSize: '1.1rem'
                        }}
                    >
                        {isFlipped ? 'Kérdés' : 'Válasz megtekintése'}
                    </Button>

                    <IconButton onClick={handleNext} size="large" sx={{ color: 'white' }}>
                        <ChevronRight size={32} />
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
