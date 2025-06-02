DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM "User" WHERE type = 'OWNER' AND id NOT IN (SELECT "userId" FROM "LandOwner")
    LOOP
        INSERT INTO "LandOwner" (id, "userId") VALUES (user_record.id, user_record.id);
        RAISE NOTICE 'Criado LandOwner para usuário %', user_record.id;
    END LOOP;
END $$;