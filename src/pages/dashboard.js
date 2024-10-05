import DashboardScreen from '../components/DashboardScreen';
import WithAuth from '../components/WithAuth';

const DashboardPage = WithAuth(DashboardScreen); 

export default DashboardPage;