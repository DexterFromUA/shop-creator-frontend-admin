import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inviteService } from '../utils/graphql';

const InvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const loadInvite = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const inviteData = await inviteService.getInvite(token);
        setInvite(inviteData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInvite();
  }, [token]);

  // Auto-accept if user is already logged in
  useEffect(() => {
    const autoAccept = async () => {
      if (user && invite && !accepting) {
        await handleAcceptInvite();
      }
    };

    autoAccept();
  }, [user, invite]);

  const handleAcceptInvite = async () => {
    if (!user) return;
    
    try {
      setAccepting(true);
      await inviteService.acceptInvite(token);
      
      // Redirect to team page
      navigate(`/store/${invite.store.id}/team`);
    } catch (error) {
      alert('Failed to accept invite: ' + error.message);
    } finally {
      setAccepting(false);
    }
  };

  const handleSignUp = () => {
    navigate(`/auth/signup?invite=${token}`);
  };

  const handleSignIn = () => {
    navigate(`/auth/signin?invite=${token}`);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--color-bg-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: 'var(--color-text)' }}>Loading invite...</div>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--color-bg-secondary)',
        padding: '48px 16px'
      }}>
        <div style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          padding: 48, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)',
          textAlign: 'center',
          maxWidth: 480
        }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>❌</div>
          <h1 style={{ margin: '0 0 16px 0', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            Invalid Invite
          </h1>
          <p style={{ margin: '0 0 32px 0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            {error || 'This invite link is invalid or has expired.'}
          </p>
          <button
            onClick={() => navigate('/auth/signin')}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--color-bg-secondary)',
        padding: '48px 16px'
      }}>
        <div style={{ 
          background: 'var(--color-bg)', 
          borderRadius: 28, 
          padding: 48, 
          boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)',
          textAlign: 'center',
          maxWidth: 480
        }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>⏳</div>
          <h1 style={{ margin: '0 0 16px 0', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
            {accepting ? 'Accepting Invite...' : 'Processing Invite'}
          </h1>
          <p style={{ margin: '0', fontSize: 16, color: 'var(--color-text-secondary)' }}>
            Please wait while we process your invitation to join &quot;{invite.store.name}&quot;.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--color-bg-secondary)',
      padding: '48px 16px'
    }}>
      <div style={{ 
        background: 'var(--color-bg)', 
        borderRadius: 28, 
        padding: 48, 
        boxShadow: '0 2px 16px 0 rgba(80,80,120,0.08)',
        textAlign: 'center',
        maxWidth: 480
      }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <h1 style={{ margin: '0 0 16px 0', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>
          You&apos;re invited!
        </h1>
        <p style={{ margin: '0 0 8px 0', fontSize: 18, color: 'var(--color-text)' }}>
          <strong>{invite.store.owner.name || invite.store.owner.email}</strong> invited you to join
        </p>
        <p style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 600, color: 'var(--color-accent)' }}>
          &quot;{invite.store.name}&quot; as {invite.role.toLowerCase()}
        </p>
        
        {invite.email && (
          <div style={{ 
            background: 'var(--color-bg-secondary)', 
            borderRadius: 12, 
            padding: 16, 
            marginBottom: 32,
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Invited email:
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)' }}>
              {invite.email}
            </div>
          </div>
        )}

        <div style={{ 
          fontSize: 14, 
          color: 'var(--color-text-secondary)', 
          marginBottom: 32 
        }}>
          ⏰ This invitation expires on {new Date(invite.expiresAt).toLocaleDateString()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            onClick={handleSignUp}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: 'none',
              background: '#111827',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Create Account & Accept
          </button>
          
          <button
            onClick={handleSignIn}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              border: '2px solid var(--color-border)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600
            }}
          >
            Sign In & Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitePage; 