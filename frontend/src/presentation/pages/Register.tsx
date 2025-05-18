import React from 'react';
import { Container, Paper, Box } from '@mui/material';
import { Fragment, memo } from "react";
import { Seo } from "@presentation/components/ui/Seo";
import { RegisterForm } from "@presentation/components/forms/Register/RegisterForm";
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";

export const RegisterPage = memo(() => {
    return <Fragment>
        <Seo title="BookSwap | Register" />
        <WebsiteLayout>
            <Box sx={{ padding: "0px 50px 0px 50px", justifyItems: "center" }}>
                <Container component="main" maxWidth="xs">
                    <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                        <RegisterForm />
                    </Paper>
                </Container>
            </Box>
        </WebsiteLayout>
    </Fragment>
});
