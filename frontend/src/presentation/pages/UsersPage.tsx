import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo, useEffect } from "react";
import { Box } from "@mui/system";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { UserTable } from "@presentation/components/ui/Tables/UserTable";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string;
  email?: string;
  nameid?: string;
}

export const UsersPage = memo(() => {
  const navigate = useNavigate();

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
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/');
    }
  }, [navigate]);

  return <Fragment>
    <Seo title="MobyLab Web App | Users" />
    <WebsiteLayout>
      <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
        <ContentCard>
          <UserTable />
        </ContentCard>
      </Box>
    </WebsiteLayout>
  </Fragment>
});
