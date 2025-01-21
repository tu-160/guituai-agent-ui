import adminRoutes from './modules/admin';
import chatRoutes from './modules/chat';
import knowledge from './modules/knowledge';
import protocolPolicy from './modules/protocolPolicy';

export default [...adminRoutes, ...chatRoutes, ...knowledge, ...protocolPolicy];
