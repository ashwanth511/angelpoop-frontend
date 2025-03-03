import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import { ToastProvider } from './components/ui/use-toast';
import { Settings } from './Pages/Settings';
import { TokenList } from './Pages/TokenList';
import { TokenView } from './Pages/TokenView';
import { LiveStreamPage } from './Pages/LiveStream';
import { Dashboard } from './Pages/Dashboard';
import { LaunchToken } from './Pages/LaunchToken';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { NetworkProvider } from './context/NetworkContext';
import { NavBar } from './components/Blocks/Navbar';
import { AuthGuard } from './components/guards/AuthGuard';

function App() {
  return (
    <TonConnectUIProvider 
      manifestUrl="https://gold-efficient-shrimp-912.mypinata.cloud/ipfs/QmSTeLxyTyU3C6po1cE52vvZyQwzdSa7moz72zevg6UJ1E"
    >
      <NetworkProvider>
        <ToastProvider>
        <Router>
          <div className="min-h-screen bg-[#14002A]">
            <NavBar />
            <main className="pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />

                {/* Protected Routes */}
                <Route element={<AuthGuard />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/tokens" element={<TokenList />} />
                  <Route path="/launch" element={<LaunchToken />} />
                  <Route path="/token/:tokenId" element={<TokenView />} />
                  <Route path="/live/:streamId?" element={<LiveStreamPage />} />
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
        </ToastProvider>
      </NetworkProvider>
    </TonConnectUIProvider>
  );
}

export default App;
