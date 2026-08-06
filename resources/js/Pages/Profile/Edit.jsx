import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout breadcrumbs={[{ label: 'Pengaturan' }]}>
            <Head title="Pengaturan" />

            <div className="space-y-6">
                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-none"
                        />
                </div>

                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <UpdatePasswordForm className="max-w-none" />
                </div>

                <div className="rounded-[28px] border border-[#E4E9F0] bg-white p-6 shadow-[0_18px_40px_rgba(8,27,48,0.06)]">
                    <DeleteUserForm className="max-w-none" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
