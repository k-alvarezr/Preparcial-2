CREATE TABLE IF NOT EXISTS appointments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_user uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    datetime timestamp NOT NULL,
    status varchar(20) NOT NULL DEFAULT 'pending',
    description text,
    created_at timestamp WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
