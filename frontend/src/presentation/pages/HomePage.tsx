import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Typography, Grid, Card, CardContent, Box } from "@mui/material";
import { Fragment, memo } from "react";
import { useIntl } from "react-intl";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';
import FeedbackIcon from '@mui/icons-material/Feedback';

export const HomePage = memo(() => {
  const { formatMessage } = useIntl();

  return (
    <Fragment>
      <Seo title="BookSwap | Home" />
      <WebsiteLayout>
        <div className="pl-[50px] pr-[50px]">
          <ContentCard title={formatMessage({ id: "globals.welcome" })}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom color="text.secondary" sx={{ mb: 2 }}>
                Your Community Book Exchange Platform
              </Typography>
              <Typography variant="body1" paragraph>
                BookSwap is a platform where book lovers can connect and exchange their favorite reads.
                Share your books with others and discover new stories from fellow readers in your community.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <LibraryBooksIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Browse Books</Typography>
                    </Box>
                    <Typography variant="body1">
                      • View all available books in the community<br />
                      • Search by title or author<br />
                      • See book details and owner information<br />
                      • Add your own books to share
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <SwapHorizIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Exchange Books</Typography>
                    </Box>
                    <Typography variant="body1">
                      • Request book exchanges with other users<br />
                      • Offer your books in return<br />
                      • Negotiate exchanges through the platform<br />
                      • Safe and secure transaction system
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Track Transactions</Typography>
                    </Box>
                    <Typography variant="body1">
                      • View your exchange history<br />
                      • Track pending requests<br />
                      • Manage active exchanges<br />
                      • Keep record of completed swaps
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <FeedbackIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">Community Feedback</Typography>
                    </Box>
                    <Typography variant="body1">
                      • Share your experience<br />
                      • Rate exchanges<br />
                      • Build trust in the community<br />
                      • Help improve the platform
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </ContentCard>
        </div>
      </WebsiteLayout>
    </Fragment>
  );
});
