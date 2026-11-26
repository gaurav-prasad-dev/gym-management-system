-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "gym_id" UUID NOT NULL,
    "member_code" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "profile_image" TEXT,
    "gender" VARCHAR(20),
    "date_of_birth" DATE,
    "occupation" VARCHAR(100),
    "phone" VARCHAR(20) NOT NULL,
    "alternate_phone" VARCHAR(20),
    "email" VARCHAR(150),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "pincode" VARCHAR(10),
    "emergency_contact_name" VARCHAR(150),
    "emergency_contact_relation" VARCHAR(100),
    "emergency_contact_phone" VARCHAR(20),
    "source" VARCHAR(50),
    "notes" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_by_id" UUID,
    "archived_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "members_gym_id_phone_idx" ON "members"("gym_id", "phone");

-- CreateIndex
CREATE INDEX "members_gym_id_status_idx" ON "members"("gym_id", "status");

-- CreateIndex
CREATE INDEX "members_gym_id_created_at_idx" ON "members"("gym_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "members_gym_id_member_code_key" ON "members"("gym_id", "member_code");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
