import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Radio,
    RadioGroup,
    Checkbox,
    Button,
    Snackbar,
    Alert,
    SelectChangeEvent
} from '@mui/material';
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment } from "react";
import { useIntl } from "react-intl";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { Configuration } from '../../api/api8082/runtime';
import { FeedbackControllerApi } from '../../api/api8082/apis/FeedbackControllerApi';
import { FeedbackRequestDTO } from '../../api/api8082/models/FeedbackRequestDTO';

type FeedbackData = FeedbackRequestDTO;

export const Feedback = () => {
    const { formatMessage } = useIntl();
    const [formData, setFormData] = useState<FeedbackData>({
        title: '',
        category: '',
        satisfaction: 'satisfied',
        subscribe: false,
        message: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const configuration = new Configuration({
        basePath: 'http://localhost:8082',
        accessToken: localStorage.getItem('token') || '',
    });

    const feedbackApi = new FeedbackControllerApi(configuration);

    const categories = [
        'Website Design',
        'User Experience',
        'Book Collection',
        'Customer Service',
        'Other'
    ];

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await feedbackApi.createFeedback({ feedbackRequestDTO: formData });

            setSnackbar({
                open: true,
                message: 'Feedback submitted successfully!',
                severity: 'success'
            });
            
            // Reset form
            setFormData({
                title: '',
                category: '',
                satisfaction: 'satisfied',
                subscribe: false,
                message: ''
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to submit feedback. Please try again.',
                severity: 'error'
            });
        }
    };

    return (
        <Fragment>
            <Seo title="BookSwap | Feedback" />
            <WebsiteLayout>
                <div className="pl-[50px] pr-[50px]">
                    <ContentCard title={formatMessage({ id: "globals.welcome" })}>
                        <Container maxWidth="md">
                            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    Feedback Form
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Feedback Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleTextChange}
                                        margin="normal"
                                    />

                                    <FormControl fullWidth margin="normal" required>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            name="category"
                                            value={formData.category}
                                            label="Category"
                                            onChange={handleSelectChange}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl component="fieldset" margin="normal" required>
                                        <Typography variant="subtitle1" gutterBottom>
                                            How satisfied are you with our service?
                                        </Typography>
                                        <RadioGroup
                                            name="satisfaction"
                                            value={formData.satisfaction}
                                            onChange={handleTextChange}
                                            row
                                        >
                                            <FormControlLabel
                                                value="very_satisfied"
                                                control={<Radio />}
                                                label="Very Satisfied"
                                            />
                                            <FormControlLabel
                                                value="satisfied"
                                                control={<Radio />}
                                                label="Satisfied"
                                            />
                                            <FormControlLabel
                                                value="neutral"
                                                control={<Radio />}
                                                label="Neutral"
                                            />
                                            <FormControlLabel
                                                value="unsatisfied"
                                                control={<Radio />}
                                                label="Unsatisfied"
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    <Box sx={{ mt: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.subscribe}
                                                    onChange={handleCheckboxChange}
                                                    name="subscribe"
                                                />
                                            }
                                            label="Subscribe to newsletter"
                                        />
                                    </Box>

                                    <TextField
                                        fullWidth
                                        required
                                        multiline
                                        rows={4}
                                        label="Your Feedback"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleTextChange}
                                        margin="normal"
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 3 }}
                                    >
                                        Submit Feedback
                                    </Button>
                                </Box>
                            </Paper>

                            <Snackbar
                                open={snackbar.open}
                                autoHideDuration={6000}
                                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                            >
                                <Alert
                                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                                    severity={snackbar.severity}
                                    sx={{ width: '100%' }}
                                >
                                    {snackbar.message}
                                </Alert>
                            </Snackbar>
                        </Container>
                    </ContentCard>
                </div>
            </WebsiteLayout>
        </Fragment>
    );
};
