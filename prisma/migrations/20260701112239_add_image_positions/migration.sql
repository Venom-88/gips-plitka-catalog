-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "imagePos" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "imagePos" TEXT;

-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "aboutImagePos" TEXT,
ADD COLUMN     "aboutImageUrl" TEXT,
ADD COLUMN     "heroImagePos" TEXT,
ADD COLUMN     "heroImageUrl" TEXT;

-- AlterTable
ALTER TABLE "works" ADD COLUMN     "imagePos" TEXT;
