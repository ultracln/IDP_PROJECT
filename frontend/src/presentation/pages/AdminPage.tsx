import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    TablePagination,
    Typography,
} from '@mui/material';
import { Configuration } from '../../api/api8082/runtime';
import { OfferControllerApi, OfferDto, FeedbackControllerApi, FeedbackResponseDTO } from '../../api/api8082';

interface JwtPayload {
  sub?: string;
  email?: string;
  nameid?: string;
}

export const AdminPage = memo(() => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferDto[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackResponseDTO[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [feedbackPage, setFeedbackPage] = useState(0);
  const [feedbackRowsPerPage, setFeedbackRowsPerPage] = useState(10);

  const configuration = new Configuration({
    basePath: 'http://localhost:8082',
    accessToken: async () => localStorage.getItem('token') || '',
  });

  const offerApi = new OfferControllerApi(configuration);
  const feedbackApi = new FeedbackControllerApi(configuration);

  const fetchAllOffers = async () => {
    try {
      const response = await offerApi.getOffers();
      const sortedOffers = [...(response || [])].reverse();
      setOffers(sortedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
    }
  };

  const fetchAllFeedbacks = async () => {
    try {
      const response = await feedbackApi.getAllFeedback();
      const sortedFeedbacks = [...(response || [])].reverse();
      setFeedbacks(sortedFeedbacks);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setFeedbacks([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSatisfactionColor = (satisfaction: string | undefined) => {
    switch (satisfaction?.toLowerCase()) {
      case 'very satisfied':
        return 'success';
      case 'satisfied':
        return 'info';
      case 'neutral':
        return 'default';
      case 'dissatisfied':
        return 'warning';
      case 'very dissatisfied':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFeedbackChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setFeedbackPage(newPage);
  };

  const handleFeedbackChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackRowsPerPage(parseInt(event.target.value, 10));
    setFeedbackPage(0);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const email = decoded.sub || decoded.email || decoded.nameid;
      
      if (email !== 'admin@admin.com') {
        navigate('/');
      } else {
        fetchAllOffers();
        fetchAllFeedbacks();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/');
    }
  }, [navigate]);

  const getCurrentPageItems = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return offers.slice(startIndex, endIndex);
  };

  const getCurrentPageFeedbacks = () => {
    const startIndex = feedbackPage * feedbackRowsPerPage;
    const endIndex = startIndex + feedbackRowsPerPage;
    return feedbacks.slice(startIndex, endIndex);
  };

  return (
    <Fragment>
      <Seo title="MobyLab Web App | Admin Dashboard" />
      <WebsiteLayout>
        <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
          <ContentCard>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800">User Management</h3>
                  <p className="text-blue-600">Manage user accounts and permissions</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Book Management</h3>
                  <p className="text-green-600">Manage books and categories</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800">System Settings</h3>
                  <p className="text-purple-600">Configure system preferences</p>
                </div>
              </div>

              {/* Transactions Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">All Transactions</h2>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Sender Email</TableCell>
                        <TableCell>Receiver Email</TableCell>
                        <TableCell>Books Requested</TableCell>
                        <TableCell>Books Offered</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCurrentPageItems().map((offer) => (
                        <TableRow key={offer.id}>
                          <TableCell>{offer.id}</TableCell>
                          <TableCell>{offer.senderEmail}</TableCell>
                          <TableCell>{offer.receiverEmail}</TableCell>
                          <TableCell>{offer.requestedBookTitles?.join(', ')}</TableCell>
                          <TableCell>{offer.offeredBookTitles?.join(', ')}</TableCell>
                          <TableCell>
                            <Chip
                              label={offer.status}
                              color={getStatusColor(offer.status || '')}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={offers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </TableContainer>
              </div>

              {/* Feedback Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Feedback</h2>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Satisfaction</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Subscribed</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCurrentPageFeedbacks().map((feedback) => (
                        <TableRow key={feedback.id}>
                          <TableCell>{feedback.id}</TableCell>
                          <TableCell>{feedback.title}</TableCell>
                          <TableCell>{feedback.category}</TableCell>
                          <TableCell>
                            <Chip
                              label={feedback.satisfaction}
                              color={getSatisfactionColor(feedback.satisfaction)}
                            />
                          </TableCell>
                          <TableCell>{feedback.message}</TableCell>
                          <TableCell>
                            <Chip
                              label={feedback.subscribe ? 'Yes' : 'No'}
                              color={feedback.subscribe ? 'success' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={feedbacks.length}
                    page={feedbackPage}
                    onPageChange={handleFeedbackChangePage}
                    rowsPerPage={feedbackRowsPerPage}
                    onRowsPerPageChange={handleFeedbackChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </TableContainer>
              </div>
            </div>
          </ContentCard>
        </Box>
      </WebsiteLayout>
    </Fragment>
  );
}); 