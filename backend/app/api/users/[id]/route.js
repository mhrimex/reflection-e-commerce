import { NextResponse } from 'next/server';
import { sql, getConnection } from '@/db';
import bcrypt from 'bcryptjs';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { username, email, roleId, password } = await request.json();

        if (!username || !email || !roleId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const pool = await getConnection();

        // If password is provided, hash it and update password
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            await pool.request()
                .input('UserID', sql.Int, id)
                .input('PasswordHash', sql.NVarChar(255), passwordHash)
                .query('UPDATE Users SET PasswordHash = @PasswordHash WHERE UserID = @UserID');
        }

        // Update other user fields
        await pool.request()
            .input('UserID', sql.Int, id)
            .input('Username', sql.NVarChar(100), username)
            .input('Email', sql.NVarChar(255), email)
            .input('RoleID', sql.Int, roleId)
            .execute('UpdateUser');

        return NextResponse.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const pool = await getConnection();
        await pool.request()
            .input('UserID', sql.Int, id)
            .execute('DeleteUser');

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('User deletion error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
