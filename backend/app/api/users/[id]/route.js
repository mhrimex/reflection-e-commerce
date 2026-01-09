import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { sql, getConnection } from '@/db';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { username, email, roleId, password } = await request.json();

        console.log(`Updating user ${id}:`, { username, email, roleId });

        if (!username || !email || !roleId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pool = await getConnection();
        const userId = Number(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        // If password is provided, hash it and update password
        if (password) {
            console.log('Updating password for user:', userId);
            const passwordHash = await bcrypt.hash(password, 10);
            await pool.request()
                .input('UserID', sql.Int, userId)
                .input('PasswordHash', sql.NVarChar(255), passwordHash)
                .query('UPDATE Users SET PasswordHash = @PasswordHash WHERE UserID = @UserID');
        }

        // Update other user fields
        await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Username', sql.NVarChar(100), username)
            .input('Email', sql.NVarChar(255), email)
            .input('RoleID', sql.Int, roleId)
            .execute('UpdateUser');

        console.log('UpdateUser successful for ID:', userId);
        return NextResponse.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        console.log(`Deleting user ID: ${id}`);

        const pool = await getConnection();
        const userId = Number(id);

        if (isNaN(userId)) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        await pool.request()
            .input('UserID', sql.Int, userId)
            .execute('DeleteUser');

        console.log('DeleteUser successful for ID:', userId);
        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('User deletion error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
