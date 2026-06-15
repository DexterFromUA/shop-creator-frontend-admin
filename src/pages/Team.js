import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

import { useStore } from '../context/StoreContext';
import { inviteService } from '../utils/graphql';
import { useToast } from '../context/ToastContext';
import PageContainer from '../components/common/PageContainer';
import Button from '../components/common/Button';
import './Dashboard.css';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, userName }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{
              background: 'var(--color-bg)',
              padding: '32px',
              borderRadius: 24,
              width: '100%',
              maxWidth: 420,
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2
              style={{
                margin: '0 0 16px 0',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--color-text)',
              }}
            >
              Remove Team Member
            </h2>
            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: 16,
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to remove <strong>{userName}</strong> from the team? This action
              cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button filled color="#ef4444" onClick={onConfirm}>
                Remove
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CreateInviteModal = ({ open, onClose, onInviteCreated, storeId }) => {
  const [form, setForm] = useState({
    description: '',
    orders: true,
    products: true,
    payouts: false,
    notifications: true,
    users: false,
    team: false,
    app: false,
    store: false,
  });
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState(null);
  const { addToast } = useToast();

  const handleClose = () => {
    setInviteLink(null);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const invite = await inviteService.createInvite({
        storeId: storeId,
        ...form,
      });

      const link = `${window.location.origin}/invite/${invite.token}`;
      setInviteLink(link);
      onInviteCreated && onInviteCreated(invite);
    } catch (error) {
      addToast('Failed to create invite: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      addToast('Invite link copied to clipboard!', 'success');
    } catch (error) {
      addToast('Failed to copy link', 'error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{
              background: 'var(--color-bg)',
              padding: '24px 32px',
              borderRadius: 24,
              width: '100%',
              maxWidth: 480,
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                {inviteLink ? 'Invite Created!' : 'Invite Team Member'}
              </h2>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            {!inviteLink ? (
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              >
                <div>
                  <label
                    style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}
                  >
                    Description
                  </label>
                  <input
                    required
                    onChange={(e) => {
                      setForm((f) => ({ ...f, description: e.target.value }));
                    }}
                    placeholder={`Enter description for this user`}
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      padding: '0.8rem 1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 10,
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      fontSize: 15,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}
                  >
                    Permissions for
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ marginRight: '50px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="order-permission"
                          checked={form.orders}
                          onChange={(e) => setForm((f) => ({ ...f, orders: e.target.checked }))}
                          style={{ width: 18, height: 18 }}
                        />
                        <label
                          htmlFor="order-permission"
                          style={{ fontSize: 15, cursor: 'pointer' }}
                        >
                          Orders
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="products-permission"
                          checked={form.products}
                          onChange={(e) => setForm((f) => ({ ...f, products: e.target.checked }))}
                          style={{ width: 18, height: 18 }}
                        />
                        <label
                          htmlFor="products-permission"
                          style={{ fontSize: 15, cursor: 'pointer' }}
                        >
                          Products
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="payouts-permission"
                          checked={form.payouts}
                          onChange={(e) => setForm((f) => ({ ...f, payouts: e.target.checked }))}
                          style={{ width: 18, height: 18 }}
                        />
                        <label
                          htmlFor="payouts-permission"
                          style={{ fontSize: 15, cursor: 'pointer' }}
                        >
                          Payouts
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="notifications-permission"
                          checked={form.notifications}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, notifications: e.target.checked }))
                          }
                          style={{ width: 18, height: 18 }}
                        />
                        <label
                          htmlFor="notifications-permission"
                          style={{ fontSize: 15, cursor: 'pointer' }}
                        >
                          Notifications
                        </label>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="users-permission"
                          checked={form.users}
                          onChange={(e) => setForm((f) => ({ ...f, users: e.target.checked }))}
                          style={{ width: 18, height: 18 }}
                        />
                        <label
                          htmlFor="users-permission"
                          style={{ fontSize: 15, cursor: 'pointer' }}
                        >
                          Users
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="team-permission"
                          checked={form.team}
                          onChange={(e) => setForm((f) => ({ ...f, team: e.target.checked }))}
                          style={{ width: 18, height: 18 }}
                        />
                        <label
                          htmlFor="team-permission"
                          style={{ fontSize: 15, cursor: 'pointer' }}
                        >
                          Team
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="app-permission"
                          checked={form.app}
                          onChange={(e) => setForm((f) => ({ ...f, app: e.target.checked }))}
                          style={{ width: 18, height: 18 }}
                        />
                        <label htmlFor="app-permission" style={{ fontSize: 15, cursor: 'pointer' }}>
                          App settings
                        </label>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <input
                          type="checkbox"
                          id="store-permission"
                          checked={form.store}
                          onChange={(e) => setForm((f) => ({ ...f, store: e.target.checked }))}
                          style={{ width: 18, height: 18 }}
                        />
                        <label
                          htmlFor="store-permission"
                          style={{ fontSize: 15, cursor: 'pointer' }}
                        >
                          Store settings
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                  <Button type="button" onClick={handleClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button filled type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Invite'}
                  </Button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label
                    style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 15 }}
                  >
                    Invite Link (expires in 7 days)
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      readOnly
                      value={inviteLink}
                      style={{
                        boxSizing: 'border-box',
                        flex: 1,
                        padding: '0.8rem 1rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 10,
                        background: 'var(--color-bg-secondary)',
                        color: 'var(--color-text)',
                        fontSize: 15,
                      }}
                    />
                    <Button filled onClick={copyToClipboard}>
                      Copy Link
                    </Button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <Button filled onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Team = () => {
  const { currentStore, refreshStore } = useStore();
  // const navigate = useNavigate();
  const { addToast } = useToast();
  const [modal, setModal] = useState({ open: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [search, setSearch] = useState('');
  const [invites, setInvites] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('members');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const buttonsRef = useRef([]);
  const containerRef = useRef(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [search, users]);

  const filteredInvites = useMemo(() => {
    return invites.filter((invite) => {
      const permissionList = invite.permissions.map((el) => el.toLowerCase());
      const matchesSearch =
        invite.description.toLowerCase().includes(search.toLowerCase()) ||
        permissionList.includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [invites, search]);

  useEffect(() => {
    const loadData = async () => {
      if (!currentStore.permissions.includes('OWNER') && !currentStore.permissions.includes('TEAM'))
        return;

      setLoading(true);

      try {
        const [invitesData, usersData] = await Promise.all([
          inviteService.getStoreInvites(currentStore.id),
          inviteService.getStoreUsers(currentStore.id),
        ]);

        setInvites([...invitesData]);
        setUsers([...usersData]);
      } catch (e) {
        addToast(e, 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStore]);

  // useEffect(() => {
  //   const handleFocus = () => {
  //     // loadInvites();
  //     refreshStore(); // Also refresh store data to get updated team members
  //   };

  //   window.addEventListener('focus', handleFocus);
  //   return () => window.removeEventListener('focus', handleFocus);
  // }, [loadInvites, refreshStore]);

  const calculateIndicator = useCallback(() => {
    const activeButton = buttonsRef.current.find((btn) => btn && btn.dataset.view === viewMode);
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      setIndicatorStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    }
  }, [viewMode]);

  useEffect(() => {
    const timer = setTimeout(calculateIndicator, 10);
    window.addEventListener('resize', calculateIndicator);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateIndicator);
    };
  }, [calculateIndicator, viewMode]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(calculateIndicator, 100);
      return () => clearTimeout(timer);
    }
  }, [calculateIndicator, loading, viewMode]);

  const handleInviteCreated = (newInvite) => {
    setInvites((prev) => [newInvite, ...prev]);
  };

  const handleRevokeInvite = async (inviteId) => {
    try {
      const revokedInvite = await inviteService.revokeInvite(inviteId);
      setInvites((prev) =>
        prev.map((invite) =>
          invite.id === inviteId
            ? { ...invite, revoked: true, revokedAt: revokedInvite.revokedAt }
            : invite
        )
      );
    } catch (error) {
      addToast('Failed to revoke invite: ' + error.message, 'error');
    }
  };

  const handleCopyInviteLink = async (token) => {
    try {
      const link = `${window.location.origin}/invite/${token}`;
      await navigator.clipboard.writeText(link);
      addToast('Invite link copied to clipboard!', 'success');
    } catch (error) {
      addToast('Failed to copy link', 'error');
    }
  };

  const handleRemoveTeamMember = (userId, userName) => {
    setDeleteModal({
      open: true,
      user: { id: userId, name: userName },
    });
  };

  const confirmRemoveTeamMember = async () => {
    if (!deleteModal.user) return;

    try {
      await inviteService.removeTeamMember(currentStore.id, deleteModal.user.id);
      refreshStore(); // Refresh store data to update team list
      setDeleteModal({ open: false, user: null });
    } catch (error) {
      addToast('Failed to remove team member: ' + error.message, 'error');
    }
  };

  return (
    <>
      {/* Search and Filter Toolbar */}
      <PageContainer
        title="Team"
        description="Manage your team—admins, managers & couriers"
        RightContent={
          <Button filled onClick={() => setModal({ open: true })}>
            + Invite Team Member
          </Button>
        }
      >
        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', minWidth: 140, maxWidth: 220, flexShrink: 1 }}>
              <input
                type="text"
                placeholder={`Search ${viewMode === 'members' ? 'members' : 'invites'}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '0.7rem 1rem 0.7rem 2.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  fontSize: 15,
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text)',
                  width: '100%',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '1.1rem',
                  pointerEvents: 'none',
                }}
              >
                🔍
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              ref={containerRef}
              style={{
                position: 'relative',
                display: 'flex',
                background: 'var(--color-bg-secondary)',
                padding: 4,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  bottom: 4,
                  ...indicatorStyle,
                  background: 'var(--color-bg)',
                  borderRadius: 6,
                  transition: 'left 0.3s ease, width 0.3s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
              <button
                ref={(el) => (buttonsRef.current[0] = el)}
                data-view="members"
                onClick={() => setViewMode('members')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 0.3s',
                }}
              >
                Members ({filteredUsers.length})
              </button>
              <button
                ref={(el) => (buttonsRef.current[1] = el)}
                data-view="invites"
                onClick={() => setViewMode('invites')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'color 0.3s',
                }}
              >
                Invites ({filteredInvites.length})
              </button>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Team Members and Invites */}
      <PageContainer
        minHeight="65vh"
        fixedSize
        loading={loading}
        loadingText={'Getting crew...'}
        removeBorderSpace
        removeBottomSpace
      >
        <div style={{ padding: 0, height: '65vh', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ padding: 0 }}
            >
              {viewMode === 'members' ? (
                // Team Members Tab
                filteredUsers.length > 0 ? (
                  filteredUsers.map((user, i) => {
                    return (
                      <div
                        key={user.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 32px',
                          borderBottom:
                            i === filteredUsers.length - 1
                              ? 'none'
                              : '1px solid var(--color-border)',
                          gap: 16,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            minWidth: 220,
                          }}
                        >
                          <div>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                              {user.name || 'No name'}
                            </h3>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 14,
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          {user.usedInvites[0].permissions.length > 0 && (
                            <span
                              style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981',
                                padding: '4px 10px',
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                              }}
                            >
                              {user.usedInvites[0].permissions.join(', ')}
                            </span>
                          )}
                          <Button
                            color="#ef4444"
                            onClick={() => handleRemoveTeamMember(user.id, user.name || user.email)}
                            style={{ padding: '6px 10px', fontSize: 13 }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>
                    {search
                      ? 'No team members found'
                      : 'No team members yet. Start by inviting someone!'}
                  </div>
                )
              ) : // Invites Tab
              filteredInvites.length > 0 ? (
                filteredInvites.map((invite, i) => {
                  const now = new Date();
                  const expiresAt = new Date(parseInt(invite.expiresAt));
                  const isExpired =
                    !invite.isUsed &&
                    !invite.revoked &&
                    !isNaN(expiresAt.getTime()) &&
                    now > expiresAt;
                  const isUsed = invite.isUsed;
                  const isRevoked = invite.revoked;

                  return (
                    <div
                      key={invite.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 32px',
                        borderBottom:
                          i === filteredInvites.length - 1
                            ? 'none'
                            : '1px solid var(--color-border)',
                        gap: 16,
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          minWidth: 220,
                        }}
                      >
                        <div>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                            {invite.description
                              ? `${invite.description.toLowerCase()} invite (${invite.permissions.join(', ')})`
                              : invite.permissions.join(', ')}
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            Created {new Date(parseInt(invite.createdAt)).toLocaleDateString()}
                            {isUsed &&
                              invite.usedAt &&
                              ` • Used ${new Date(parseInt(invite.usedAt)).toLocaleDateString()}`}
                            {isRevoked &&
                              invite.revokedAt &&
                              ` • Revoked ${new Date(parseInt(invite.revokedAt)).toLocaleDateString()}`}
                            {!isUsed &&
                              !isRevoked &&
                              ` • Expires ${new Date(parseInt(invite.expiresAt)).toLocaleDateString()}`}
                            {isUsed &&
                              invite.usedBy &&
                              ` by ${invite.usedBy.name || invite.usedBy.email}`}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span
                          style={{
                            background: isUsed
                              ? 'rgba(16, 185, 129, 0.1)'
                              : isRevoked
                                ? 'rgba(239, 68, 68, 0.1)'
                                : isExpired
                                  ? 'rgba(107, 114, 128, 0.1)'
                                  : 'rgba(251, 191, 36, 0.1)',
                            color: isUsed
                              ? '#10b981'
                              : isRevoked
                                ? '#ef4444'
                                : isExpired
                                  ? '#6b7280'
                                  : '#f59e0b',
                            padding: '4px 10px',
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        >
                          {isUsed
                            ? 'Used'
                            : isRevoked
                              ? 'Revoked'
                              : isExpired
                                ? 'Expired'
                                : `Pending`}
                        </span>
                        {!isUsed && !isRevoked && !isExpired && (
                          <>
                            <Button
                              color="#10b981"
                              onClick={() => handleCopyInviteLink(invite.token)}
                              style={{ padding: '6px 10px', fontSize: 13 }}
                            >
                              Copy
                            </Button>
                            <Button
                              color="#ef4444"
                              onClick={() => handleRevokeInvite(invite.id)}
                              style={{ padding: '6px 10px', fontSize: 13 }}
                            >
                              Revoke
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#aaa', padding: '32px 0', textAlign: 'center' }}>
                  {search ? 'No invites found' : 'No pending invites. Create one to get started!'}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </PageContainer>

      <CreateInviteModal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        onInviteCreated={handleInviteCreated}
        storeId={currentStore?.id}
      />

      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={confirmRemoveTeamMember}
        userName={deleteModal.user?.name || 'Unknown User'}
      />
    </>
  );
};

export default Team;
