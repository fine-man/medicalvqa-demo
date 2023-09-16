import React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { CardHeader, Typography } from '@mui/material'
import Button from '@mui/material/Button';

const MyCard = ({ title, content }) => {
    const handleNavigation = () => {
        // Use window.location to navigate to the desired URL
        window.location.href = '/module'; // Replace '/another-page' with your desired URL
    };
    return (
        <Card sx={{ maxWidth: '25rem', margin: '3rem auto', height: '30rem', backgroundColor: '#f5f5f5d1', fontSize: '1.8rem' }}>
            <CardHeader
                titleTypographyProps={{ variant: 'h5', style: { fontSize: '2.2rem', fontFamily: '"Bebas Neue", sans-serif' }}}
                title={title}
                subheader="Created 12/10/22"
            />
            <CardContent>
                <Typography paragraph style={{ fontSize: '1.1rem' }}>{content}</Typography>
            </CardContent>

            <Button variant="contained" onClick={handleNavigation}>
                Learn More
            </Button>
        </Card>
    )
};

export default MyCard;
