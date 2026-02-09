import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const CardContainer = styled(Box)(({ theme }) => ({
    perspective: '1000px',
    width: '100%',
    maxWidth: '600px',
    minHeight: '350px',
    cursor: 'pointer',
    margin: '20px auto',
}));

const InnerCard = styled(motion.div)({
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
});

const CardFace = styled(Card)(({ theme }) => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    // Allow content to scroll if it's too large, but keep it centered
    overflowY: 'auto',
    minHeight: '350px',
}));

const CardBack = styled(CardFace)(({ theme }) => ({
    transform: 'rotateY(180deg)',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
}));

const renderText = (text) => {
    if (!text) return null;

    // Improved regex to handle $formula$ and ($formula$)
    // We use a capture group in split to keep the delimiters in the resulting array
    const parts = text.split(/(\$[^$]+\$|\(\$[^$]+\$\))/g);

    return parts.map((part, index) => {
        // Check if part is a formula: either $formula$ or ($formula$)
        // Match group 1 if it's ($formula$) or just $formula$
        const formulaMatch = part.match(/^\(?\$(.+?)\$\)?$/);
        if (formulaMatch) {
            const formula = formulaMatch[1];
            // console.log('Rendering formula:', formula);
            return <InlineMath key={index} math={formula} />;
        }
        return part;
    });
};

const Flashcard = ({ question, answer, isFlipped, onFlip, onNext, onPrevious }) => {
    const swipeThreshold = 50;

    const handleDragEnd = (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -swipeThreshold || velocity < -500) {
            onNext?.();
        } else if (offset > swipeThreshold || velocity > 500) {
            onPrevious?.();
        }
    };

    return (
        <CardContainer>
            <InnerCard
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                whileTap={{ cursor: 'grabbing' }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                onClick={(e) => {
                    // Only flip if it wasn't a significant drag
                    if (Math.abs(e.defaultPrevented)) return; // This might not be enough
                    onFlip();
                }}
            >
                {/* Front Side */}
                <CardFace sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                    <Typography variant="overline" color="primary" sx={{ mb: 2, fontWeight: 700 }}>
                        KÉRDÉS
                    </Typography>
                    <Typography variant="h5" component="div">
                        {renderText(question)}
                    </Typography>
                </CardFace>

                {/* Back Side */}
                <CardBack sx={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}>
                    <Typography variant="overline" sx={{ mb: 2, fontWeight: 700, opacity: 0.8 }}>
                        VÁLASZ
                    </Typography>
                    <Typography variant="h5" component="div">
                        {renderText(answer)}
                    </Typography>
                </CardBack>
            </InnerCard>
        </CardContainer>
    );
};

export default Flashcard;
