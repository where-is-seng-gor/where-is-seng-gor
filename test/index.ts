import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function emptyDatabase() {
  let tables = Prisma.dmmf.datamodel.models.map(
    (model) => model.dbName || model.name
  );

  tables = [...tables];

  console.log("tables", tables);

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM ${table};`);
  }
}

async function seedDatabase() {
  await prisma.character.create({
    data: {
      name: "頂上賀老爹",
      say: "「去香港，無管好對腳，面都紅！」",
      attributes: {
        createMany: {
          data: [
            { emoji: "😡", name: "面都紅晒" },
            { emoji: "🦶", name: "管好對腳" },
            { emoji: "😀", name: "笑左" },
            { emoji: "🤬", name: "面都紅晒(口罩版)" },
            { emoji: "💪", name: "澳門加油" },
            { emoji: "👴", name: "老爹你最近好嗎" },
          ],
        },
      },
    },
  });

  await prisma.character.create({
    data: {
      name: "奇異失蹤局長",
      say: "「我升職快過打針！」",
      attributes: {
        createMany: {
          data: [
            { emoji: "🐶", name: "搜索犬希望搵得返" },
            { emoji: "💉", name: "打支升職針先" },
            { emoji: "😀", name: "笑左" },
            { emoji: "🤬", name: "面都紅晒(口罩版)" },
            { emoji: "💪", name: "澳門加油" },
            { emoji: "🐉", name: "我左翼龍右翼好" },
          ],
        },
      },
    },
  });

  await prisma.character.create({
    data: {
      name: "一個好姨醫生",
      say: "「我只係一個醫生！」",
      attributes: {
        createMany: {
          data: [
            { emoji: "🩺", name: "醫生幫緊你" },
            { emoji: "🙌", name: "手頭上無資料" },
            { emoji: "😀", name: "笑左" },
            { emoji: "🤬", name: "面都紅晒(口罩版)" },
            { emoji: "💪", name: "澳門加油" },
            { emoji: "💩", name: "唔關我事我打工仔" },
          ],
        },
      },
    },
  });

  await prisma.character.create({
    data: {
      name: "白衣人和撩鼻佬",
      say: "「。。。」",
      attributes: {
        createMany: {
          data: [
            { emoji: "😷", name: "帶個罩先" },
            { emoji: "👃", name: "做鼻?" },
            { emoji: "👄", name: "做口?" },
            { emoji: "⛑", name: "紅碼" },
            { emoji: "🪖", name: "綠碼" },
            { emoji: "👆🏼", name: "撩撩撩撩夠未" },
          ],
        },
      },
    },
  });
}

async function reseedDatabase() {
  // await emptyDatabase();
  await seedDatabase();
}

async function main() {
  await reseedDatabase();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
