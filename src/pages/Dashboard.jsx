import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  People,
  ShoppingCart,
  AttachMoney,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const StatCard = ({ title, value, icon, trend, color = 'primary' }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {trend && (
              <Chip
                label={trend}
                size="small"
                color="success"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.main`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color: 'white', fontSize: 28 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/segmentation/analytics');
      setAnalytics(response.data.data.analytics);
      setError('');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
      // Set mock data for demo purposes
      setAnalytics({
        overview: {
          totalUsers: 1250,
          totalPurchases: 3456,
          totalRevenue: 125000,
          averageOrderValue: 85.50
        },
        monthlyRevenue: [
          { _id: { month: 1 }, revenue: 15000, count: 120 },
          { _id: { month: 2 }, revenue: 18000, count: 145 },
          { _id: { month: 3 }, revenue: 22000, count: 180 },
          { _id: { month: 4 }, revenue: 25000, count: 200 },
          { _id: { month: 5 }, revenue: 28000, count: 220 },
          { _id: { month: 6 }, revenue: 32000, count: 250 },
          { _id: { month: 7 }, revenue: 30000, count: 235 },
          { _id: { month: 8 }, revenue: 35000, count: 280 },
          { _id: { month: 9 }, revenue: 38000, count: 300 },
          { _id: { month: 10 }, revenue: 42000, count: 320 },
          { _id: { month: 11 }, revenue: 45000, count: 350 },
          { _id: { month: 12 }, revenue: 48000, count: 380 },
        ],
        topCategories: [
          { _id: 'Electronics', revenue: 45000, count: 120 },
          { _id: 'Clothing', revenue: 32000, count: 200 },
          { _id: 'Books', revenue: 18000, count: 300 },
          { _id: 'Home & Garden', revenue: 22000, count: 150 },
          { _id: 'Sports', revenue: 15000, count: 100 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Typography variant="h6" align="center" color="error">
        No analytics data available
      </Typography>
    );
  }

  const { overview, monthlyRevenue, topCategories } = analytics;

  // Format monthly data for charts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedMonthlyData = monthlyRevenue?.map(item => ({
    ...item,
    month: monthNames[item._id.month - 1],
    revenue: item.revenue || 0
  })) || [];

  return (
    <Box>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your customer segmentation today.
        </Typography>
      </Box>
      
      {/* Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value={overview.totalUsers?.toLocaleString() || '0'}
            icon={<People />}
            trend="+12% this month"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={overview.totalPurchases?.toLocaleString() || '0'}
            icon={<ShoppingCart />}
            trend="+8% this month"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`GH₵${overview.totalRevenue?.toLocaleString() || '0'}`}
            icon={<AttachMoney />}
            trend="+15% this month"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Order Value"
            value={`GH₵${overview.averageOrderValue?.toFixed(2) || '0.00'}`}
            icon={<TrendingUp />}
            trend="+5% this month"
            color="info"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Revenue Trend */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={formattedMonthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  tickFormatter={(value) => `GH₵${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`GH₵${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: '#666' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1976d2" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Category Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Top Categories
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={topCategories?.slice(0, 5) || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {topCategories?.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`GH₵${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box 
                display="flex" 
                alignItems="center" 
                p={2} 
                bgcolor="background.default" 
                borderRadius={2}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <People sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle2">Create New Segment</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use AI to segment your customers
                  </Typography>
                </Box>
              </Box>
              <Box 
                display="flex" 
                alignItems="center" 
                p={2} 
                bgcolor="background.default" 
                borderRadius={2}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TrendingUp sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="subtitle2">Run Analysis</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analyze customer behavior patterns
                  </Typography>
                </Box>
              </Box>
              <Box 
                display="flex" 
                alignItems="center" 
                p={2} 
                bgcolor="background.default" 
                borderRadius={2}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ShoppingCart sx={{ mr: 2, color: 'warning.main' }} />
                <Box>
                  <Typography variant="subtitle2">Launch Campaign</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start targeted marketing campaigns
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Performance Metrics
            </Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Customer Retention</Typography>
                  <Typography variant="body2" color="success.main" fontWeight="bold">85%</Typography>
                </Box>
                <Box bgcolor="background.default" borderRadius={1} height={8}>
                  <Box 
                    bgcolor="success.main" 
                    borderRadius={1} 
                    height="100%" 
                    width="85%" 
                    sx={{ transition: 'width 0.3s ease' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Conversion Rate</Typography>
                  <Typography variant="body2" color="warning.main" fontWeight="bold">72%</Typography>
                </Box>
                <Box bgcolor="background.default" borderRadius={1} height={8}>
                  <Box 
                    bgcolor="warning.main" 
                    borderRadius={1} 
                    height="100%" 
                    width="72%" 
                    sx={{ transition: 'width 0.3s ease' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Customer Satisfaction</Typography>
                  <Typography variant="body2" color="info.main" fontWeight="bold">90%</Typography>
                </Box>
                <Box bgcolor="background.default" borderRadius={1} height={8}>
                  <Box 
                    bgcolor="info.main" 
                    borderRadius={1} 
                    height="100%" 
                    width="90%" 
                    sx={{ transition: 'width 0.3s ease' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Market Growth</Typography>
                  <Typography variant="body2" color="error.main" fontWeight="bold">68%</Typography>
                </Box>
                <Box bgcolor="background.default" borderRadius={1} height={8}>
                  <Box 
                    bgcolor="error.main" 
                    borderRadius={1} 
                    height="100%" 
                    width="68%" 
                    sx={{ transition: 'width 0.3s ease' }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Activity
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between" p={2} bgcolor="background.default" borderRadius={2}>
                <Box display="flex" alignItems="center">
                  <People sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2">New customer segment created</Typography>
                    <Typography variant="body2" color="text.secondary">
                      "High-Value Customers" segment with 234 users
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">2 hours ago</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" p={2} bgcolor="background.default" borderRadius={2}>
                <Box display="flex" alignItems="center">
                  <TrendingUp sx={{ mr: 2, color: 'success.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Campaign performance update</Typography>
                    <Typography variant="body2" color="text.secondary">
                      "Summer Sale" campaign achieved 15% conversion rate
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">4 hours ago</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" p={2} bgcolor="background.default" borderRadius={2}>
                <Box display="flex" alignItems="center">
                  <AttachMoney sx={{ mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Revenue milestone reached</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly revenue exceeded GH₵125,000 target
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">1 day ago</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}