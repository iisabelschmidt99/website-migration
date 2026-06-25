-- Schritt 1 von 2: Enum-Wert committen lassen, dann 20260623230000_admin_rbac_security.sql ausführen.
alter type public.user_role add value if not exists 'super_admin' before 'admin';
