import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function main() {
  const cmd = process.argv[2];
  const arg = process.argv[3];

  if (cmd === 'list') {
    const users = await p.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true,
        _count: { select: { words: true, sentences: true, favorites: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`\n${users.length} users:\n`);
    users.forEach((u) => {
      const d = new Date(u.createdAt).toLocaleDateString();
      console.log(`  [${u.id}] ${u.username} (${u.email}) | ${u.role} | ${d}`);
      console.log(`       words:${u._count.words} sent:${u._count.sentences} favs:${u._count.favorites}\n`);
    });
  } else if (cmd === 'admin' && arg) {
    const user = await p.user.findUnique({ where: { email: arg } });
    if (!user) { console.log('User not found'); return; }
    await p.user.update({ where: { id: user.id }, data: { role: 'admin' } });
    console.log(`Set ${user.username} as admin`);
  } else if (cmd === 'del' && arg) {
    const user = await p.user.findUnique({ where: { email: arg } });
    if (!user) { console.log('User not found'); return; }
    if (user.role === 'admin') { console.log('Cannot delete admin'); return; }
    await p.user.delete({ where: { id: user.id } });
    console.log(`Deleted ${user.username}`);
  } else if (cmd === 'stats') {
    const [u, a, w, s, f] = await Promise.all([
      p.user.count(), p.article.count(), p.savedWord.count(), p.savedSentence.count(), p.favorite.count(),
    ]);
    console.log(`\n  Users: ${u}  Articles: ${a}  Words: ${w}  Sentences: ${s}  Favorites: ${f}\n`);
  } else {
    console.log(`
Usage: npx tsx admin.ts <command> [arg]

  list                  List all users
  admin <email>         Set user as admin
  del <email>           Delete a non-admin user
  stats                 Show platform stats
`);
  }

  await p.$disconnect();
}

main();
